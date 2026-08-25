from __future__ import annotations

from dataclasses import dataclass
from typing import TypedDict

from langgraph.graph import END, START, StateGraph
from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.prompts import SYSTEM_PROMPT
from app.modules.ai_assistant.application.tool_registry import ToolRegistry
from app.modules.ai_assistant.application.types import AssistantGraphState, ToolCallRecord
from app.modules.ai_assistant.infrastructure.llm_client import BaseLLMClient


def classify_intent(prompt: str) -> str:
    normalized = prompt.lower()
    if any(token in normalized for token in ("policy", "how does")):
        return "policy_help"
    if any(token in normalized for token in ("return", "refund", "exchange", "replace", "damage", "damaged", "broken")):
        return "return_support"
    if any(token in normalized for token in ("track", "shipment", "delivery", "delivered", "courier")):
        return "shipping_support"
    if any(token in normalized for token in ("order", "purchase", "bought", "my order")):
        return "order_support"
    if any(token in normalized for token in ("cart", "checkout", "coupon")):
        return "cart_help"
    if any(token in normalized for token in ("help", "support")):
        return "policy_help"
    if any(token in normalized for token in ("account", "notification", "alert")):
        return "account_help"
    if any(token in normalized for token in ("compare", "vs", "difference", "better")):
        return "product_compare"
    if any(token in normalized for token in ("gift", "recommend", "suggest", "best for")):
        return "product_recommendation"
    return "product_search"


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
        builder.add_node("select_tools", self._select_tools_node)
        builder.add_node("run_tools", lambda payload: self._run_tools_node(db, payload))
        builder.add_node("generate_answer", self._generate_answer_node)

        builder.add_edge(START, "classify_intent")
        builder.add_edge("classify_intent", "select_tools")
        builder.add_edge("select_tools", "run_tools")
        builder.add_edge("run_tools", "generate_answer")
        builder.add_edge("generate_answer", END)
        return builder.compile()

    def _classify_intent_node(self, payload: LangGraphAssistantState) -> LangGraphAssistantState:
        state = payload["state"]
        state.intent = classify_intent(state.prompt)
        state.tool_records.append(
            ToolCallRecord(
                tool_name="langgraph.classify_intent",
                status="completed",
                detail=f"Intent classified as {state.intent}.",
            )
        )
        return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

    def _select_tools_node(self, payload: LangGraphAssistantState) -> LangGraphAssistantState:
        state = payload["state"]
        selected_tools = self.tool_registry.select_for_intent(state.intent)
        if not selected_tools:
            self.tool_registry.record_skip(
                state,
                tool_name="langgraph.select_tools",
                detail=f"No tools registered for intent {state.intent}.",
            )
        else:
            state.tool_records.append(
                ToolCallRecord(
                    tool_name="langgraph.select_tools",
                    status="completed",
                    detail=f"Selected {len(selected_tools)} tools for {state.intent}.",
                    payload={"tools": [tool.name for tool in selected_tools]},
                )
            )
        return {"state": state, "selected_tool_names": [tool.name for tool in selected_tools]}

    def _run_tools_node(self, db: Session, payload: LangGraphAssistantState) -> LangGraphAssistantState:
        state = payload["state"]
        selected_names = set(payload.get("selected_tool_names", []))
        selected_tools = [tool for tool in self.tool_registry.tools if tool.name in selected_names]
        for tool in selected_tools:
            state = tool.run(db, state)
        return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

    def _generate_answer_node(self, payload: LangGraphAssistantState) -> LangGraphAssistantState:
        state = payload["state"]
        completion = self.llm_client.complete(system_prompt=SYSTEM_PROMPT, user_prompt=state.prompt)
        product_count = len(state.products)
        if state.metadata.get("auth_required"):
            state.answer = (
                "I can help with that after you sign in. "
                "Once you are logged in, share your order ID and I can check the order, delivery, "
                "refund, or replacement options for you."
            )
            state.confirmation_required = False
            return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

        support_intents = {
            "order_support",
            "shipping_support",
            "return_support",
            "cart_help",
            "policy_help",
            "account_help",
        }
        if state.intent in support_intents:
            knowledge = state.metadata.get("knowledge", [])
            orders = state.metadata.get("orders", [])
            shipment = state.metadata.get("shipment")
            cart = state.metadata.get("cart")
            notifications = state.metadata.get("notifications")
            return_workflow = state.metadata.get("return_workflow")
            fragments: list[str] = [completion.content]
            if isinstance(return_workflow, dict):
                state.answer = self._format_return_workflow_answer(return_workflow)
                state.metadata["llm_provider"] = completion.provider
                state.metadata["llm_model"] = completion.model
                state.metadata["orchestrator"] = "langgraph"
                return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}
            if isinstance(cart, dict):
                cart_summary = (
                    f"You have {cart.get('total_items', 0)} item(s) in your cart worth "
                    f"{cart.get('currency', 'INR')} {cart.get('subtotal', '0')}."
                )
                fragments.append(
                    cart_summary
                )
            if isinstance(orders, list) and orders:
                latest_order = orders[0]
                fragments.append(
                    f"Your latest order {latest_order['order_number']} is {latest_order['status']} right now."
                )
            if isinstance(shipment, dict):
                shipment_summary = (
                    f"Delivery status is {shipment.get('status', 'pending')}. "
                    f"Carrier: {shipment.get('carrier', 'internal')}."
                )
                fragments.append(
                    shipment_summary
                )
            if isinstance(notifications, dict):
                fragments.append(f"You have {notifications.get('unread_count', 0)} unread notifications.")
            if isinstance(knowledge, list) and knowledge:
                fragments.append(str(knowledge[0].get("content", "")))
            if state.intent == "return_support":
                fragments.append(
                    "For a damaged item, I can help you check replacement, refund, or similar product options once I verify the order."
                )
            state.answer = " ".join(fragment for fragment in fragments if fragment).strip()
            state.metadata["llm_provider"] = completion.provider
            state.metadata["llm_model"] = completion.model
            state.metadata["orchestrator"] = "langgraph"
            return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

        if product_count > 0:
            state.answer = (
                f"{completion.content} "
                f"I found {product_count} option(s) that may work for you."
            )
        else:
            suggestions = state.metadata.get("suggestions", [])
            if suggestions:
                state.answer = (
                    f"{completion.content} I could not find an exact match. "
                    f"You can also try: {', '.join(suggestions[:3])}."
                )
            else:
                state.answer = (
                    f"{completion.content} I could not find an exact match. "
                    "Try a broader category, brand, budget, or product use."
                )
        state.metadata["llm_provider"] = completion.provider
        state.metadata["llm_model"] = completion.model
        state.metadata["orchestrator"] = "langgraph"
        return {"state": state, "selected_tool_names": payload.get("selected_tool_names", [])}

    def _format_return_workflow_answer(self, workflow: dict) -> str:
        if workflow.get("status") == "needs_order_id":
            recent_orders = workflow.get("recent_orders", [])
            if isinstance(recent_orders, list) and recent_orders:
                order_lines = ", ".join(
                    str(order.get("order_number") or order.get("id"))
                    for order in recent_orders[:3]
                    if isinstance(order, dict)
                )
                return (
                    "I can help with a refund, replacement, or similar product. "
                    "Please share the order ID for the damaged item. "
                    f"Your recent orders are: {order_lines}."
                )
            return (
                "I can help with a refund, replacement, or similar product. "
                "Please share the order ID for the damaged item so I can verify it."
            )

        order = workflow.get("order") if isinstance(workflow.get("order"), dict) else {}
        order_number = order.get("order_number") or order.get("id") or "this order"
        eligible = bool(workflow.get("eligible"))
        replacement_available = bool(workflow.get("replacement_available"))
        similar_product_count = int(workflow.get("similar_product_count") or 0)
        items = workflow.get("items", [])
        item_names = [
            str(item.get("product_name"))
            for item in items
            if isinstance(item, dict) and item.get("product_name")
        ]
        item_summary = ", ".join(item_names[:3]) if item_names else "the ordered item"
        existing_returns = workflow.get("existing_returns", [])

        if not eligible:
            return (
                f"I found order {order_number} for {item_summary}. "
                "A refund or replacement usually starts after delivery. "
                "For now, I can help you track it, explain the return policy, or connect you with support."
            )

        if isinstance(existing_returns, list) and existing_returns:
            latest = existing_returns[0]
            status = latest.get("status", "requested") if isinstance(latest, dict) else "requested"
            return (
                f"I found order {order_number} for {item_summary}. "
                f"A return request is already open for this order. Current status: {status}. "
                "I can still show similar products or explain the refund and replacement policy."
            )

        if not replacement_available and similar_product_count > 0:
            return (
                f"I found order {order_number} for {item_summary}. "
                "The same item is not available for replacement right now. "
                f"I found {similar_product_count} similar in-stock option(s) you can choose from, "
                "or you can request a refund according to the return policy."
            )

        if not replacement_available:
            return (
                f"I found order {order_number} for {item_summary}. "
                "The same item is not available for replacement right now. "
                "I can help you request a refund or connect you with support."
            )

        return (
            f"I found order {order_number} for {item_summary}. "
            "This order is eligible for help. You can replace the item, request a refund, "
            "view similar products, or contact support if the damage needs review."
        )
