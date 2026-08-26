from __future__ import annotations

import re
import json
from dataclasses import dataclass
from typing import Any, TypedDict

from langgraph.graph import END, START, StateGraph
from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.prompts import SYSTEM_PROMPT
from app.modules.ai_assistant.application.tool_registry import ToolRegistry
from app.modules.ai_assistant.application.types import AssistantGraphState, ToolCallRecord
from app.modules.ai_assistant.infrastructure.llm_client import BaseLLMClient


ORDER_ID_PATTERN = r"\b(?:ORD|WORD)-[A-Z0-9-]+\b"
ORDER_ITEM_ID_PATTERN = r"\bITM-[A-Z0-9-]+\b"
RETURN_TICKET_PATTERN = r"\bRET-[A-Z0-9]+\b"
PRICE_PATTERN = r"(?:under|below|less than|upto|up to)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d+)*(?:\.\d+)?)"
AUTH_REQUIRED_INTENTS = {
    "ACCOUNT",
    "ADDRESS",
    "CART_VIEW",
    "CART_ADD",
    "CART_REMOVE",
    "CART_UPDATE",
    "CHECKOUT",
    "PLACE_ORDER",
    "ORDER_DETAILS",
    "ORDER_HISTORY",
    "ORDER_STATUS",
    "ORDER_TRACKING",
    "DELIVERY_STATUS",
    "DELIVERY_DATE",
    "DELIVERY_DELAY",
    "DELIVERY_ADDRESS",
    "ORDER_CANCEL",
    "RETURN_REQUEST",
    "RETURN_STATUS",
    "REPLACEMENT_REQUEST",
    "REPLACEMENT_STATUS",
    "EXCHANGE_REQUEST",
    "REFUND_REQUEST",
    "REFUND_STATUS",
    "PAYMENT_STATUS",
    "PAYMENT_FAILED",
    "PAYMENT_REFUND",
    "DUPLICATE_PAYMENT",
    "INVOICE",
    "GST_INVOICE",
}
PUBLIC_POLICY_INTENTS = {
    "RETURN_POLICY",
    "REFUND_POLICY",
    "SHIPPING_POLICY",
    "CANCELLATION_POLICY",
    "EXCHANGE_POLICY",
    "WARRANTY_POLICY",
    "PRIVACY_POLICY",
    "TERMS_CONDITIONS",
}
LEGACY_PRIMARY_INTENT_MAP = {
    "PRODUCT_SEARCH": "product_search",
    "PRODUCT_DETAILS": "product_search",
    "PRODUCT_RECOMMENDATION": "product_recommendation",
    "PRODUCT_COMPARISON": "product_compare",
    "PRODUCT_AVAILABILITY": "product_search",
    "PRODUCT_PRICE": "product_search",
    "PRODUCT_REVIEWS": "product_search",
    "PRODUCT_WISHLIST": "product_search",
    "CART_VIEW": "cart_help",
    "CART_ADD": "cart_help",
    "CART_REMOVE": "cart_help",
    "CART_UPDATE": "cart_help",
    "CHECKOUT": "checkout_help",
    "PLACE_ORDER": "checkout_help",
    "ORDER_DETAILS": "order_support",
    "ORDER_HISTORY": "order_support",
    "ORDER_STATUS": "order_support",
    "ORDER_TRACKING": "shipping_support",
    "DELIVERY_STATUS": "shipping_support",
    "DELIVERY_DATE": "shipping_support",
    "DELIVERY_DELAY": "shipping_support",
    "DELIVERY_ADDRESS": "shipping_support",
    "ORDER_CANCEL": "order_support",
    "RETURN_REQUEST": "return_support",
    "RETURN_STATUS": "return_support",
    "RETURN_POLICY": "policy_help",
    "REPLACEMENT_REQUEST": "return_support",
    "REPLACEMENT_STATUS": "return_support",
    "EXCHANGE_REQUEST": "return_support",
    "REFUND_REQUEST": "return_support",
    "REFUND_STATUS": "return_support",
    "REFUND_POLICY": "policy_help",
    "PAYMENT_METHOD": "checkout_help",
    "PAYMENT_STATUS": "order_support",
    "PAYMENT_FAILED": "order_support",
    "PAYMENT_REFUND": "return_support",
    "DUPLICATE_PAYMENT": "order_support",
    "COUPON": "cart_help",
    "DISCOUNT": "product_search",
    "PROMOTION": "product_search",
    "INVOICE": "order_support",
    "GST_INVOICE": "order_support",
    "SHIPPING_POLICY": "policy_help",
    "CANCELLATION_POLICY": "policy_help",
    "EXCHANGE_POLICY": "policy_help",
    "WARRANTY_POLICY": "policy_help",
    "PRIVACY_POLICY": "policy_help",
    "TERMS_CONDITIONS": "policy_help",
    "WARRANTY": "policy_help",
    "ACCOUNT": "account_help",
    "ADDRESS": "account_help",
    "PASSWORD": "account_help",
    "COMPLAINT": "account_help",
    "HUMAN_SUPPORT": "account_help",
    "GENERAL_QUESTION": "product_search",
    "WEB_SEARCH": "product_search",
}
INTENT_KEYWORDS: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("PRODUCT_COMPARISON", ("compare", "vs", "versus", "difference", "better than")),
    ("PRODUCT_RECOMMENDATION", ("recommend", "suggest", "best for", "gift", "which should i buy")),
    ("PRODUCT_DETAILS", ("details", "specs", "specifications", "features", "tell me about")),
    ("PRODUCT_AVAILABILITY", ("in stock", "available", "availability")),
    ("PRODUCT_PRICE", ("price", "cost", "under", "below", "budget")),
    ("PRODUCT_REVIEWS", ("review", "reviews", "rating", "ratings")),
    ("CART_VIEW", ("cart", "my cart", "view cart")),
    ("CART_ADD", ("add to cart",)),
    ("CART_REMOVE", ("remove from cart",)),
    ("CART_UPDATE", ("update cart", "change quantity")),
    ("CHECKOUT", ("checkout", "payment options", "payment method")),
    ("PLACE_ORDER", ("place order", "buy now")),
    ("ORDER_TRACKING", ("track", "tracking", "where is my order")),
    ("DELIVERY_STATUS", ("delivery status", "delivery update", "delivered", "shipment")),
    ("DELIVERY_DATE", ("delivery date", "arrive", "eta", "expected delivery")),
    ("DELIVERY_DELAY", ("late", "delayed", "delay")),
    ("ORDER_DETAILS", ("order details", "my order", "order summary")),
    ("ORDER_HISTORY", ("recent orders", "order history", "past orders")),
    ("ORDER_STATUS", ("order status", "status of my order")),
    ("ORDER_CANCEL", ("cancel order", "cancellation")),
    ("RETURN_REQUEST", ("return", "return this", "return request")),
    ("RETURN_STATUS", ("return status",)),
    ("RETURN_POLICY", ("return policy",)),
    ("REPLACEMENT_REQUEST", ("replace", "replacement", "exchange for another")),
    ("REPLACEMENT_STATUS", ("replacement status",)),
    ("EXCHANGE_REQUEST", ("exchange",)),
    ("REFUND_REQUEST", ("refund", "money back")),
    ("REFUND_STATUS", ("refund status",)),
    ("REFUND_POLICY", ("refund policy",)),
    ("PAYMENT_STATUS", ("payment status", "payment pending")),
    ("PAYMENT_FAILED", ("payment failed", "payment error")),
    ("PAYMENT_REFUND", ("payment refund",)),
    ("DUPLICATE_PAYMENT", ("double charged", "duplicate payment", "charged twice")),
    ("COUPON", ("coupon", "promo code", "discount code")),
    ("DISCOUNT", ("discount", "deal", "offer")),
    ("PROMOTION", ("promotion", "sale")),
    ("INVOICE", ("invoice", "bill")),
    ("GST_INVOICE", ("gst invoice",)),
    ("SHIPPING_POLICY", ("shipping policy",)),
    ("CANCELLATION_POLICY", ("cancellation policy",)),
    ("EXCHANGE_POLICY", ("exchange policy",)),
    ("WARRANTY_POLICY", ("warranty policy",)),
    ("WARRANTY", ("warranty",)),
    ("PRIVACY_POLICY", ("privacy policy",)),
    ("TERMS_CONDITIONS", ("terms and conditions", "terms & conditions")),
    ("ACCOUNT", ("account", "profile")),
    ("ADDRESS", ("address", "delivery address")),
    ("PASSWORD", ("password", "reset password")),
    ("COMPLAINT", ("complaint", "issue with service")),
    ("HUMAN_SUPPORT", ("human", "agent", "support executive", "customer support")),
    ("WEB_SEARCH", ("latest", "today", "current", "news")),
)

LLM_INTENT_SYSTEM_PROMPT = """
You classify ecommerce customer chat messages.
Return only valid JSON, with no markdown.
Schema:
{
  "intents": ["RETURN_REQUEST"],
  "primary_intent": "return_support",
  "entities": {
    "return_ticket_id": "RET-ABC12345",
    "order_id": "ORD-ABC123",
    "order_item_id": "ITM-ABC123",
    "sku": "SKU-123",
    "product_id": "uuid-or-id",
    "product_query": "samsung phone",
    "quantity": 1,
    "max_price": 50000,
    "status_filter": "delivered",
    "requested_limit": 2,
    "issue_reason": "damaged",
    "requested_action": "replacement",
    "in_stock_only": true
  }
}
Use these primary_intent values only: product_search, product_recommendation, product_compare, cart_help, checkout_help, order_support, shipping_support, return_support, policy_help, account_help.
Use legacy intent names from ecommerce support flows, for example ORDER_HISTORY, ORDER_TRACKING, RETURN_REQUEST, REPLACEMENT_REQUEST, REFUND_REQUEST, PRODUCT_SEARCH, PRODUCT_PRICE, PRODUCT_AVAILABILITY, RETURN_POLICY.
If the customer types WORD-... as an order id, normalize it to ORD-....
For ticket/reference IDs starting RET-, choose return_support and include return_ticket_id.
For add-to-cart requests, choose cart_help, include CART_ADD in intents, and extract sku/product_id/product_query/quantity.
For damaged, broken, cracked, defective, refund, return, replace, exchange, choose return_support.
For latest/last/recent delivered orders, choose order_support and include status_filter/requested_limit.
For product search, include product_query and max_price/in_stock_only when present.
"""


def classify_intents(prompt: str, conversation_summary: str = "") -> list[str]:
    normalized = prompt.lower()
    combined_context = f"{normalized} {conversation_summary.lower()}".strip()
    intents: list[str] = []

    for intent, keywords in INTENT_KEYWORDS:
        if any(keyword in normalized for keyword in keywords):
            intents.append(intent)

    return_tokens = ("return", "retuen", "retrun", "refund", "replace", "replacement", "exchange")
    ticket_tokens = ("ticket", "reference", "request id", "return id", "status")
    order_context_tokens = ("order", "orders", "purchase", "purchased")
    recent_tokens = ("latest", "last", "recent", "past", "history")
    if any(token in normalized for token in order_context_tokens) and any(token in normalized for token in recent_tokens):
        intents.insert(0, "ORDER_HISTORY")
    cart_word_pattern = r"\b(?:cart|crat|crt|caart|carrt|basket)\b"
    if re.search(rf"\b(add|put|move)\b.*{cart_word_pattern}", normalized):
        intents.insert(0, "CART_ADD")
    if re.search(rf"\b(remove|delete|drop)\b.*{cart_word_pattern}", normalized) or re.search(
        rf"{cart_word_pattern}.*\b(remove|delete|drop)\b", normalized
    ):
        intents.insert(0, "CART_REMOVE")
    if re.search(rf"\b(set|update|change)\b.*\b(qty|quantity)\b", normalized) or re.search(
        rf"\b(qty|quantity)\b.*\b(set|update|change)\b", normalized
    ):
        intents.insert(0, "CART_UPDATE")
    elif re.search(cart_word_pattern, normalized):
        intents.insert(0, "CART_VIEW")
    if any(token in normalized for token in return_tokens):
        intents.insert(0, "RETURN_REQUEST")
    if re.search(RETURN_TICKET_PATTERN, prompt.upper()) or (
        any(token in normalized for token in ticket_tokens) and "ret-" in normalized
    ):
        intents.insert(0, "RETURN_STATUS")

    if re.search(ORDER_ITEM_ID_PATTERN, prompt.upper()):
        intents.insert(0, "RETURN_REQUEST")
        intents.append("ORDER_DETAILS")
    if re.search(ORDER_ID_PATTERN, prompt.upper()):
        if any(token in normalized for token in return_tokens):
            intents.insert(0, "RETURN_REQUEST")
        intents.append("ORDER_DETAILS")

    if any(token in combined_context for token in ("damaged", "broken", "defective")):
        intents.insert(0, "RETURN_REQUEST")
        intents.append("REFUND_REQUEST")
    if any(token in normalized for token in ("phone", "laptop", "shoe", "shirt", "headphone", "watch")):
        intents.append("PRODUCT_SEARCH")

    if not intents:
        intents.append("GENERAL_QUESTION")

    deduped: list[str] = []
    for intent in intents:
        if intent not in deduped:
            deduped.append(intent)
    return deduped


def classify_intent(prompt: str) -> str:
    return _primary_intent_from_multi(classify_intents(prompt))


def _primary_intent_from_multi(intents: list[str]) -> str:
    primary = intents[0] if intents else "GENERAL_QUESTION"
    return LEGACY_PRIMARY_INTENT_MAP.get(primary, "product_search")


def _parse_llm_json(content: str) -> dict[str, Any] | None:
    stripped = content.strip()
    if not stripped:
        return None
    if stripped.startswith("```"):
        stripped = re.sub(r"^```(?:json)?", "", stripped).strip()
        stripped = re.sub(r"```$", "", stripped).strip()
    try:
        parsed = json.loads(stripped)
    except ValueError:
        match = re.search(r"\{.*\}", stripped, flags=re.DOTALL)
        if not match:
            return None
        try:
            parsed = json.loads(match.group(0))
        except ValueError:
            return None
    return parsed if isinstance(parsed, dict) else None


def _merge_unique_intents(*intent_lists: list[str]) -> list[str]:
    merged: list[str] = []
    for intents in intent_lists:
        for intent in intents:
            normalized = str(intent).strip().upper()
            if normalized and normalized not in merged:
                merged.append(normalized)
    return merged


def _clean_entities(entities: dict[str, Any]) -> dict[str, Any]:
    cleaned: dict[str, Any] = {}
    allowed = {
        "order_id",
        "order_item_id",
        "return_ticket_id",
        "sku",
        "product_id",
        "product_query",
        "keywords",
        "quantity",
        "max_price",
        "status_filter",
        "requested_limit",
        "issue_reason",
        "requested_action",
        "in_stock_only",
    }
    for key, value in entities.items():
        if key not in allowed or value in (None, "", []):
            continue
        if key in {"order_id", "order_item_id", "return_ticket_id"}:
            text_value = str(value).upper().strip()
            if text_value.startswith("WORD-"):
                text_value = f"ORD-{text_value[5:]}"
            cleaned[key] = text_value
        elif key == "requested_limit":
            try:
                cleaned[key] = max(1, min(10, int(value)))
            except (TypeError, ValueError):
                continue
        elif key == "quantity":
            try:
                cleaned[key] = max(1, min(10, int(value)))
            except (TypeError, ValueError):
                continue
        elif key == "max_price":
            cleaned[key] = str(value).replace(",", "")
        else:
            cleaned[key] = value
    return cleaned


class LangGraphAssistantState(TypedDict):
    state: AssistantGraphState
    selected_tool_names: list[str]


@dataclass(slots=True)
class AssistantGraph:
    tool_registry: ToolRegistry
    llm_client: BaseLLMClient

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        graph = self._build_graph(db)
        result = graph.invoke({"state": state, "selected_tool_names": []})
        return result["state"]

    def _build_graph(self, db: Session):
        builder = StateGraph(LangGraphAssistantState)
        builder.add_node("classify_intent", self._classify_intent_node)
        builder.add_node("extract_entities", self._extract_entities_node)
        builder.add_node("authenticate_user", self._authenticate_user_node)
        builder.add_node("route_query", self._route_query_node)
        builder.add_node("select_tools", self._select_tools_node)
        builder.add_node("run_tools", lambda payload: self._run_tools_node(db, payload))
        builder.add_node("generate_answer", self._generate_answer_node)
        builder.add_node("validate_response", self._validate_response_node)

        builder.add_edge(START, "classify_intent")
        builder.add_edge("classify_intent", "extract_entities")
        builder.add_edge("extract_entities", "authenticate_user")
        builder.add_edge("authenticate_user", "route_query")
        builder.add_edge("route_query", "select_tools")
        builder.add_edge("select_tools", "run_tools")
        builder.add_edge("run_tools", "generate_answer")
        builder.add_edge("generate_answer", "validate_response")
        builder.add_edge("validate_response", END)
        return builder.compile()

    def _classify_intent_node(self, payload: LangGraphAssistantState) -> LangGraphAssistantState:
        state = payload["state"]
        rule_intents = classify_intents(state.prompt, state.conversation_summary)
        state.intents = rule_intents
        state.intent = _primary_intent_from_multi(rule_intents)
        llm_payload = self._llm_intelligence(state)
        if llm_payload:
            llm_intents = [
                intent
                for intent in llm_payload.get("intents", [])
                if isinstance(intent, str)
            ]
            primary_intent = str(llm_payload.get("primary_intent", "")).strip()
            if llm_intents:
                state.intents = _merge_unique_intents(llm_intents, rule_intents)
            if primary_intent in {
                "product_search",
                "product_recommendation",
                "product_compare",
                "cart_help",
                "checkout_help",
                "order_support",
                "shipping_support",
                "return_support",
                "policy_help",
                "account_help",
            }:
                state.intent = primary_intent
            else:
                state.intent = _primary_intent_from_multi(state.intents)
            state.metadata["llm_intelligence"] = {
                "enabled": True,
                "primary_intent": primary_intent,
                "intents": llm_intents,
            }
            entities = llm_payload.get("entities", {})
            if isinstance(entities, dict):
                state.metadata["llm_entities"] = _clean_entities(entities)
        else:
            state.metadata["llm_intelligence"] = {"enabled": False}
        state.metadata["intents"] = state.intents
        state.tool_records.append(
            ToolCallRecord(
                tool_name="langgraph.classify_intent",
                status="completed",
                detail=f"Classified intents: {', '.join(state.intents)}.",
                payload={"intents": state.intents, "primary_intent": state.intent},
            )
        )
        return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

    def _extract_entities_node(self, payload: LangGraphAssistantState) -> LangGraphAssistantState:
        state = payload["state"]
        entities: dict[str, str | int | list[str] | bool] = {}
        llm_entities = state.metadata.get("llm_entities", {})
        if isinstance(llm_entities, dict):
            entities.update(llm_entities)
        if order_id_match := re.search(ORDER_ID_PATTERN, state.prompt.upper()):
            order_id = order_id_match.group(0)
            entities["order_id"] = f"ORD-{order_id[5:]}" if order_id.startswith("WORD-") else order_id
        if order_item_match := re.search(ORDER_ITEM_ID_PATTERN, state.prompt.upper()):
            entities["order_item_id"] = order_item_match.group(0)
        if return_ticket_match := re.search(RETURN_TICKET_PATTERN, state.prompt.upper()):
            entities["return_ticket_id"] = return_ticket_match.group(0)
        if quantity_match := re.search(r"\b(?:qty|quantity|x)\s*(\d{1,2})\b", state.prompt.lower()):
            entities["quantity"] = max(1, min(10, int(quantity_match.group(1))))
        elif add_quantity_match := re.search(r"\badd\s+(\d{1,2})\b", state.prompt.lower()):
            entities["quantity"] = max(1, min(10, int(add_quantity_match.group(1))))
        if budget_match := re.search(PRICE_PATTERN, state.prompt.lower()):
            entities["max_price"] = budget_match.group(1).replace(",", "")
        product_terms = [
            token
            for token in re.findall(r"[a-z0-9]+", state.prompt.lower())
            if token not in {"i", "my", "need", "want", "show", "track", "order", "refund", "return", "policy"}
        ]
        if product_terms:
            entities["keywords"] = product_terms[:8]
        state.entities = entities
        state.metadata["entities"] = entities
        state.tool_records.append(
            ToolCallRecord(
                tool_name="langgraph.extract_entities",
                status="completed",
                detail=f"Extracted entities: {', '.join(entities.keys()) or 'none'}.",
            )
        )
        return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

    def _llm_intelligence(self, state: AssistantGraphState) -> dict[str, Any] | None:
        completion = self.llm_client.complete(
            system_prompt=LLM_INTENT_SYSTEM_PROMPT,
            user_prompt=state.prompt,
            context={
                "conversation_summary": state.conversation_summary,
                "rule_intents": classify_intents(state.prompt, state.conversation_summary),
            },
        )
        state.metadata["intent_llm_provider"] = completion.provider
        state.metadata["intent_llm_model"] = completion.model
        parsed = _parse_llm_json(completion.content)
        if parsed is None:
            state.tool_records.append(
                ToolCallRecord(
                    tool_name="langgraph.llm_intelligence",
                    status="skipped",
                    detail="LLM did not return structured JSON; used rule-based intent extraction.",
                )
            )
            return None
        state.tool_records.append(
            ToolCallRecord(
                tool_name="langgraph.llm_intelligence",
                status="completed",
                detail="Used LLM structured intent and entity extraction.",
            )
        )
        return parsed

    def _authenticate_user_node(self, payload: LangGraphAssistantState) -> LangGraphAssistantState:
        state = payload["state"]
        requires_auth = any(intent in AUTH_REQUIRED_INTENTS for intent in state.intents)
        state.requires_authentication = requires_auth and state.context.user_id is None
        state.metadata["requires_authentication"] = state.requires_authentication
        if state.requires_authentication:
            state.tool_records.append(
                ToolCallRecord(
                    tool_name="langgraph.authenticate_user",
                    status="completed",
                    detail="Authentication required for one or more intents.",
                )
            )
        else:
            state.tool_records.append(
                ToolCallRecord(
                    tool_name="langgraph.authenticate_user",
                    status="completed",
                    detail="Authentication check passed.",
                )
            )
        return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

    def _route_query_node(self, payload: LangGraphAssistantState) -> LangGraphAssistantState:
        state = payload["state"]
        routed_intents = list(state.intents)
        if "GENERAL_QUESTION" in routed_intents and len(routed_intents) > 1:
            routed_intents = [intent for intent in routed_intents if intent != "GENERAL_QUESTION"]
        if state.requires_authentication and not any(intent in PUBLIC_POLICY_INTENTS for intent in routed_intents):
            state.metadata["route"] = "auth_gate"
        elif any(intent in PUBLIC_POLICY_INTENTS for intent in routed_intents):
            state.metadata["route"] = "policy_rag"
        elif any(intent.startswith("PRODUCT_") for intent in routed_intents):
            state.metadata["route"] = "catalog_tools"
        else:
            state.metadata["route"] = "support_tools"
        state.metadata["routed_intents"] = routed_intents
        state.tool_records.append(
            ToolCallRecord(
                tool_name="langgraph.route_query",
                status="completed",
                detail=f"Route selected: {state.metadata['route']}.",
                payload={"routed_intents": routed_intents},
            )
        )
        return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

    def _select_tools_node(self, payload: LangGraphAssistantState) -> LangGraphAssistantState:
        state = payload["state"]
        selected_tools = self.tool_registry.select_for_intents(self._tool_intents_for_state(state))
        if not selected_tools:
            self.tool_registry.record_skip(
                state,
                tool_name="langgraph.select_tools",
                detail=f"No tools registered for intents {state.intents}.",
            )
        else:
            state.tool_records.append(
                ToolCallRecord(
                    tool_name="langgraph.select_tools",
                    status="completed",
                    detail=f"Selected {len(selected_tools)} tools.",
                    payload={"tools": [tool.name for tool in selected_tools]},
                )
            )
        return {"state": state, "selected_tool_names": [tool.name for tool in selected_tools]}

    def _tool_intents_for_state(self, state: AssistantGraphState) -> list[str]:
        legacy_intents = {_primary_intent_from_multi([intent]) for intent in state.intents}
        legacy_intents.add(state.intent)
        return list(legacy_intents)

    def _run_tools_node(self, db: Session, payload: LangGraphAssistantState) -> LangGraphAssistantState:
        state = payload["state"]
        selected_names = set(payload.get("selected_tool_names", []))
        selected_tools = [tool for tool in self.tool_registry.tools if tool.name in selected_names]
        for tool in selected_tools:
            before_count = len(state.tool_records)
            state = tool.run(db, state)
            completed_records = state.tool_records[before_count:]
            state.tool_results.extend(
                {"tool_name": record.tool_name, "status": record.status, "detail": record.detail}
                for record in completed_records
            )
        return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

    def _generate_answer_node(self, payload: LangGraphAssistantState) -> LangGraphAssistantState:
        state = payload["state"]
        completion = self.llm_client.complete(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=state.prompt,
            context={
                "intents": state.intents,
                "entities": state.entities,
                "metadata": state.metadata,
                "product_count": len(state.products),
            },
        )
        if state.requires_authentication:
            public_policy_intents = [intent for intent in state.intents if intent in PUBLIC_POLICY_INTENTS]
            if public_policy_intents and state.metadata.get("knowledge"):
                state.answer = (
                    f"{self._compose_policy_answer(state, completion.content)} "
                    "For order-specific tracking or account details, please sign in first."
                ).strip()
            else:
                state.answer = (
                    "I can help with that after you sign in. Once you are logged in, I can check your orders, "
                    "returns, payments, invoices, and account-specific details."
                )
            state.confirmation_required = False
            state.metadata["auth_required"] = True
            self._record_llm_metadata(state, completion)
            return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

        if any(intent in PUBLIC_POLICY_INTENTS for intent in state.intents):
            state.answer = self._compose_policy_answer(state, completion.content)
        elif state.intent in {"order_support", "shipping_support", "return_support", "cart_help", "checkout_help", "account_help"}:
            state.answer = self._compose_support_answer(state, completion.content)
        else:
            state.answer = self._compose_product_answer(state, completion.content)

        self._record_llm_metadata(state, completion)
        return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

    def _validate_response_node(self, payload: LangGraphAssistantState) -> LangGraphAssistantState:
        state = payload["state"]
        if not state.answer.strip():
            state.answer = "I’m sorry, but I could not generate a helpful answer right now."
        if state.products and "I found" not in state.answer and state.intent.startswith("product"):
            state.answer = f"{state.answer} I found {len(state.products)} option(s) that may help."
        state.tool_records.append(
            ToolCallRecord(
                tool_name="langgraph.validate_response",
                status="completed",
                detail="Validated assistant response payload.",
            )
        )
        return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

    def _compose_policy_answer(self, state: AssistantGraphState, llm_content: str) -> str:
        knowledge = state.metadata.get("knowledge", [])
        snippets = [
            str(doc.get("content", "")).strip()
            for doc in knowledge
            if isinstance(doc, dict) and doc.get("content")
        ]
        state.retrieved_documents = [doc for doc in knowledge if isinstance(doc, dict)]
        if snippets:
            return " ".join([llm_content, snippets[0]]).strip()
        return llm_content

    def _compose_support_answer(self, state: AssistantGraphState, llm_content: str) -> str:
        fragments: list[str] = []
        if isinstance(state.metadata.get("cart_action"), dict):
            action = state.metadata["cart_action"]
            product_name = action.get("product_name", "that product")
            if action.get("status") == "added":
                sku_text = f" SKU: {action.get('sku')}." if action.get("sku") else ""
                return f"Added {product_name} to your cart.{sku_text}"
            if action.get("status") == "removed":
                return f"Removed {product_name} from your cart."
            if action.get("status") == "updated":
                return f"Updated {product_name} quantity to {action.get('quantity', 1)}."
            if action.get("status") == "not_found":
                return "I could not find that SKU or product ID. Please copy the SKU from a product card and try again."
            if action.get("status") == "not_in_cart":
                return f"{product_name} is not in your cart right now."
            if action.get("status") == "out_of_stock":
                return f"{product_name} is currently out of stock, so I cannot add it to your cart."
            if action.get("status") == "needs_product_id":
                return "Please share the SKU or product ID you want me to add to your cart."
            if action.get("status") == "failed":
                return str(action.get("message") or "I could not add that product to your cart right now.")
        if isinstance(state.metadata.get("return_ticket"), dict):
            ticket = state.metadata["return_ticket"]
            return (
                "Your return ticket "
                f"{ticket.get('reference_id', 'RET')} is {ticket.get('lifecycle_status', 'open')}. "
                f"Current status: {ticket.get('status', 'requested')}. "
                f"Product: {ticket.get('product_name', 'order item')}."
            )
        if isinstance(state.metadata.get("return_tickets"), list):
            tickets = state.metadata["return_tickets"]
            if tickets:
                ticket_lines = ", ".join(
                    f"{ticket.get('reference_id', 'RET')} ({ticket.get('lifecycle_status', 'open')}, {ticket.get('status', 'requested')})"
                    for ticket in tickets[:3]
                    if isinstance(ticket, dict)
                )
                return f"Here are your recent return tickets: {ticket_lines}."
            if state.intent == "return_support":
                return "I could not find any return or replacement tickets on your account yet."
        if isinstance(state.metadata.get("cart"), dict):
            cart = state.metadata["cart"]
            items = cart.get("items", [])
            total_text = (
                f"Your cart currently has {cart.get('total_items', 0)} item(s) "
                f"worth {cart.get('currency', 'INR')} {cart.get('subtotal', '0')}."
            )
            if isinstance(items, list) and items:
                item_lines = ", ".join(
                    f"{item.get('quantity', 1)} x {item.get('product_name', 'item')}"
                    for item in items[:5]
                    if isinstance(item, dict)
                )
                fragments.append(f"{total_text} Items: {item_lines}.")
            else:
                fragments.append(total_text)
        if isinstance(state.metadata.get("orders"), list) and state.metadata["orders"]:
            orders = state.metadata["orders"]
            lookup = state.metadata.get("order_lookup", {})
            status_filter = lookup.get("status_filter") if isinstance(lookup, dict) else None
            if len(orders) == 1:
                latest_order = orders[0]
                fragments.append(
                    f"I found your order {latest_order.get('order_number', 'order')}. Current status: {latest_order.get('status', 'processing')}."
                )
            else:
                filter_text = f" {str(status_filter).replace('_', ' ')}" if status_filter else ""
                order_lines = ", ".join(
                    f"{order.get('order_number', 'order')} ({order.get('status', 'processing')})"
                    for order in orders[:5]
                )
                fragments.append(f"I found {len(orders)}{filter_text} orders: {order_lines}.")
        if isinstance(state.metadata.get("shipment"), dict):
            shipment = state.metadata["shipment"]
            fragments.append(
                f"Shipment status is {shipment.get('status', 'pending')} with {shipment.get('carrier', 'our delivery partner')}."
            )
        if isinstance(state.metadata.get("notifications"), dict):
            notifications = state.metadata["notifications"]
            fragments.append(f"You have {notifications.get('unread_count', 0)} unread notification(s).")
        if isinstance(state.metadata.get("return_workflow"), dict):
            workflow = state.metadata["return_workflow"]
            if workflow.get("status") == "needs_order_id":
                recent_orders = workflow.get("recent_orders", [])
                if recent_orders:
                    order_lines = ", ".join(str(item.get("order_number", item.get("id"))) for item in recent_orders[:3])
                    fragments.append(f"Please choose the delivered order for this return. Eligible orders: {order_lines}.")
                else:
                    fragments.append("I could not find any delivered order eligible for return or replacement right now.")
            elif workflow.get("status") == "verified":
                if workflow.get("eligible"):
                    if workflow.get("needs_item_choice"):
                        fragments.append("This order has more than one item. Please select the damaged product below so I can start the correct return or replacement.")
                    else:
                        target = workflow.get("target_item", {})
                        product_name = target.get("product_name") if isinstance(target, dict) else None
                        item_text = f" for {product_name}" if product_name else ""
                        fragments.append(f"This delivered item{item_text} is eligible. Select a damage reason, upload proof, then choose replacement or refund.")
                else:
                    fragments.append("This order is not delivered yet, so return or replacement can start after delivery is completed.")
        if isinstance(state.metadata.get("knowledge"), list) and state.metadata["knowledge"]:
            if state.intent == "return_support" and not state.metadata.get("return_workflow"):
                fragments.append(str(state.metadata["knowledge"][0].get("content", "")))
        if not fragments and llm_content:
            fragments.append(llm_content)
        return " ".join(fragment for fragment in fragments if fragment).strip()

    def _compose_product_answer(self, state: AssistantGraphState, llm_content: str) -> str:
        if state.products:
            return f"{llm_content} I found {len(state.products)} option(s) that may work for you."
        suggestions = state.metadata.get("suggestions", [])
        if suggestions:
            return f"I could not find an exact match. Try one of these instead: {', '.join(suggestions[:3])}."
        return "I could not find matching products right now. Try a category, brand, budget, or product name."

    def _record_llm_metadata(self, state: AssistantGraphState, completion) -> None:
        state.metadata["llm_provider"] = completion.provider
        state.metadata["llm_model"] = completion.model
        state.metadata["orchestrator"] = "langgraph"
