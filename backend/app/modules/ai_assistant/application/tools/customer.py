from __future__ import annotations

from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.rag import retrieve_knowledge
from app.modules.ai_assistant.application.tool_registry import AssistantTool
from app.modules.ai_assistant.application.types import AssistantGraphState, ToolCallRecord
from app.modules.cart.application.service import build_cart_response, get_cart
from app.modules.notifications.application.service import list_notifications, unread_notification_count
from app.modules.orders.application.service import list_orders_for_user
from app.modules.shipping.application.service import get_shipment_for_user


class CartSnapshotTool(AssistantTool):
    name = "cart.snapshot"
    intent_names = ("cart_help", "checkout_help")

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        if state.context.user_id is None:
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="Authentication required.")
            )
            state.metadata["auth_required"] = True
            return state
        cart = build_cart_response(db, cart=get_cart(db, user_id=state.context.user_id))
        state.metadata["cart"] = {
            "total_items": cart.total_items,
            "subtotal": str(cart.subtotal),
            "currency": cart.currency,
        }
        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Loaded cart with {cart.total_items} items.",
            )
        )
        return state


class OrderLookupTool(AssistantTool):
    name = "orders.lookup"
    intent_names = ("order_support", "shipping_support", "return_support")

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        if state.context.user_id is None:
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="Authentication required.")
            )
            state.metadata["auth_required"] = True
            return state
        orders = list_orders_for_user(db, user_id=state.context.user_id)
        state.metadata["orders"] = [
            {
                "id": order.id,
                "order_number": order.order_number,
                "status": order.status,
                "subtotal": str(order.subtotal),
                "created_at": order.created_at.isoformat(),
            }
            for order in orders[:3]
        ]
        state.tool_records.append(
            ToolCallRecord(tool_name=self.name, status="completed", detail=f"Loaded {len(orders[:3])} recent orders.")
        )
        return state


class ShipmentStatusTool(AssistantTool):
    name = "shipping.status"
    intent_names = ("shipping_support",)

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        orders = state.metadata.get("orders", [])
        if state.context.user_id is None or not isinstance(orders, list) or not orders:
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="No order context available.")
            )
            return state
        order_id = str(orders[0]["id"])
        try:
            shipment = get_shipment_for_user(db, user_id=state.context.user_id, order_id=order_id)
        except ValueError as exc:
            state.tool_records.append(ToolCallRecord(tool_name=self.name, status="skipped", detail=str(exc)))
            return state
        state.metadata["shipment"] = {
            "status": shipment.status,
            "carrier": shipment.carrier,
            "tracking_number": shipment.tracking_number,
            "events": [event.status for event in shipment.events[:5]],
        }
        state.tool_records.append(
            ToolCallRecord(tool_name=self.name, status="completed", detail=f"Loaded shipment status {shipment.status}.")
        )
        return state


class ReturnPolicyTool(AssistantTool):
    name = "knowledge.return_policy"
    intent_names = ("return_support", "policy_help")

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        docs = retrieve_knowledge(db, query=f"returns {state.prompt}", limit=2)
        state.metadata["knowledge"] = [
            {"title": doc.title, "category": doc.category, "content": doc.content}
            for doc in docs
        ]
        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Retrieved {len(docs)} policy knowledge docs.",
            )
        )
        return state


class NotificationSummaryTool(AssistantTool):
    name = "notifications.summary"
    intent_names = ("account_help", "order_support")

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        if state.context.user_id is None:
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="Authentication required.")
            )
            return state
        notifications = list_notifications(db, user_id=state.context.user_id)[:3]
        unread_count = unread_notification_count(db, user_id=state.context.user_id)
        state.metadata["notifications"] = {
            "unread_count": unread_count,
            "latest_titles": [notification.title for notification in notifications],
        }
        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Loaded {len(notifications)} notifications.",
            )
        )
        return state
