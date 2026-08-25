from __future__ import annotations

import re

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.rag import retrieve_knowledge
from app.modules.ai_assistant.application.tool_registry import AssistantTool
from app.modules.ai_assistant.application.types import AssistantGraphState, ToolCallRecord
from app.modules.cart.application.service import build_cart_response, get_cart
from app.modules.catalog.application.service import hydrate_product_read_model, list_products
from app.modules.catalog.domain.models import Product
from app.modules.notifications.application.service import list_notifications, unread_notification_count
from app.modules.orders.domain.models import Order
from app.modules.orders.application.service import list_orders_for_user
from app.modules.returns.application.service import list_returns_for_user
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


class ReturnWorkflowTool(AssistantTool):
    name = "returns.workflow"
    intent_names = ("return_support",)

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        if state.context.user_id is None:
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="Authentication required.")
            )
            state.metadata["auth_required"] = True
            return state

        orders = list_orders_for_user(db, user_id=state.context.user_id)
        order = self._match_order(db, state.prompt, orders)
        if order is None:
            state.metadata["return_workflow"] = {
                "status": "needs_order_id",
                "message": "Ask the customer for the order ID before starting a return or replacement.",
                "recent_orders": [
                    {
                        "id": item.id,
                        "order_number": item.order_number,
                        "status": item.status,
                        "created_at": item.created_at.isoformat(),
                    }
                    for item in orders[:3]
                ],
            }
            state.metadata["quick_replies"] = [
                "Where can I find my order ID?",
                "Track my latest order",
                "Show my recent orders",
            ]
            state.confirmation_required = True
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="completed", detail="Return workflow needs order ID.")
            )
            return state

        existing_returns = [
            request
            for request in list_returns_for_user(db, user_id=state.context.user_id)
            if request.order_id == order.id
        ]
        eligible = order.status in {"delivered", "returned", "partially_returned"}
        items = [
            {
                "order_item_id": item.id,
                "product_id": item.product_id,
                "product_name": item.product_name,
                "quantity": item.quantity,
                "unit_price": str(item.unit_price),
            }
            for item in order.items
        ]

        similar_products = self._similar_products(db, order)
        if similar_products and not state.products:
            state.products = similar_products

        state.metadata["return_workflow"] = {
            "status": "verified",
            "eligible": eligible,
            "order": {
                "id": order.id,
                "order_number": order.order_number,
                "status": order.status,
                "created_at": order.created_at.isoformat(),
            },
            "items": items,
            "existing_returns": [
                {
                    "id": request.id,
                    "order_item_id": request.order_item_id,
                    "quantity": request.quantity,
                    "reason": request.reason,
                    "status": request.status,
                }
                for request in existing_returns
            ],
            "next_actions": (
                ["Request replacement", "Request refund", "Show similar products", "Contact support"]
                if eligible
                else ["Track delivery", "Contact support", "Review return policy"]
            ),
        }
        state.metadata["quick_replies"] = state.metadata["return_workflow"]["next_actions"]
        state.confirmation_required = eligible
        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Verified return workflow for order {order.order_number}.",
            )
        )
        return state

    def _match_order(self, db: Session, prompt: str, orders: list[Order]) -> Order | None:
        candidates = set(re.findall(r"[A-Z0-9][A-Z0-9-]{5,}", prompt.upper()))
        for order in orders:
            if order.order_number.upper() in candidates or order.id.upper() in candidates:
                return order

        uuid_match = re.search(
            r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
            prompt,
        )
        if uuid_match:
            matched = db.scalar(
                select(Order).where(Order.id == uuid_match.group(0), Order.user_id == orders[0].user_id)
            ) if orders else None
            if matched is not None:
                return matched

        if len(orders) == 1 and any(token in prompt.lower() for token in ("latest", "last", "recent", "this order")):
            return orders[0]
        return None

    def _similar_products(self, db: Session, order: Order) -> list[Product]:
        first_item = order.items[0] if order.items else None
        if first_item is None:
            return []
        source = db.get(Product, first_item.product_id)
        if source is None:
            return []
        products = list_products(
            db,
            published_only=True,
            category_slugs=[source.category.slug] if source.category else None,
        )
        return [
            hydrate_product_read_model(db, product)
            for product in products
            if product.id != source.id
        ][:4]


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
