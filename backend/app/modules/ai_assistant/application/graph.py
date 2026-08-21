from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.prompts import SYSTEM_PROMPT
from app.modules.ai_assistant.application.tool_registry import ToolRegistry
from app.modules.ai_assistant.application.types import AssistantGraphState, ToolCallRecord
from app.modules.ai_assistant.infrastructure.llm_client import BaseLLMClient


def classify_intent(prompt: str) -> str:
    normalized = prompt.lower()
    if any(token in normalized for token in ("return", "refund", "exchange", "replace")):
        return "return_support"
    if any(token in normalized for token in ("track", "shipment", "delivery", "delivered", "courier")):
        return "shipping_support"
    if any(token in normalized for token in ("order", "purchase", "bought", "my order")):
        return "order_support"
    if any(token in normalized for token in ("cart", "checkout", "coupon")):
        return "cart_help"
    if any(token in normalized for token in ("policy", "how does", "help", "support")):
        return "policy_help"
    if any(token in normalized for token in ("account", "notification", "alert")):
        return "account_help"
    if any(token in normalized for token in ("compare", "vs", "difference", "better")):
        return "product_compare"
    if any(token in normalized for token in ("gift", "recommend", "suggest", "best for")):
        return "product_recommendation"
    return "product_search"


@dataclass(slots=True)
class AssistantGraph:
    tool_registry: ToolRegistry
    llm_client: BaseLLMClient

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        state.intent = classify_intent(state.prompt)
        state.tool_records.append(
            ToolCallRecord(
                tool_name="graph.classify_intent",
                status="completed",
                detail=f"Intent classified as {state.intent}.",
            )
        )

        selected_tools = self.tool_registry.select_for_intent(state.intent)
        if not selected_tools:
            self.tool_registry.record_skip(
                state,
                tool_name="graph.select_tools",
                detail=f"No tools registered for intent {state.intent}.",
            )

        for tool in selected_tools:
            state = tool.run(db, state)

        completion = self.llm_client.complete(system_prompt=SYSTEM_PROMPT, user_prompt=state.prompt)
        product_count = len(state.products)
        if state.metadata.get("auth_required"):
            state.answer = (
                "I can help with that once you are signed in. "
                "Please log in so I can safely access your cart, orders, or account details."
            )
            state.confirmation_required = False
            return state

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
            fragments: list[str] = [completion.content]
            if isinstance(cart, dict):
                cart_summary = (
                    f"Your cart currently has {cart.get('total_items', 0)} items worth "
                    f"{cart.get('currency', 'INR')} {cart.get('subtotal', '0')}."
                )
                fragments.append(
                    cart_summary
                )
            if isinstance(orders, list) and orders:
                latest_order = orders[0]
                fragments.append(
                    f"Your latest order {latest_order['order_number']} is currently {latest_order['status']}."
                )
            if isinstance(shipment, dict):
                shipment_summary = (
                    f"Shipment status is {shipment.get('status', 'pending')} "
                    f"with carrier {shipment.get('carrier', 'internal')}."
                )
                fragments.append(
                    shipment_summary
                )
            if isinstance(notifications, dict):
                fragments.append(f"You have {notifications.get('unread_count', 0)} unread notifications.")
            if isinstance(knowledge, list) and knowledge:
                fragments.append(str(knowledge[0].get("content", "")))
            state.answer = " ".join(fragment for fragment in fragments if fragment).strip()
            return state

        if product_count > 0:
            state.answer = (
                f"{completion.content} "
                f"I found {product_count} matching product options for '{state.prompt}'."
            )
        else:
            suggestions = state.metadata.get("suggestions", [])
            if suggestions:
                state.answer = (
                    f"{completion.content} I could not find direct matches for '{state.prompt}'. "
                    f"Try related searches like {', '.join(suggestions[:3])}."
                )
            else:
                state.answer = (
                    f"{completion.content} I could not find direct matches for '{state.prompt}'. "
                    "Try using a broader category, brand, or use-case."
                )
        state.metadata["llm_provider"] = completion.provider
        state.metadata["llm_model"] = completion.model
        return state
