from __future__ import annotations

import re
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.modules.ai_assistant.application.rag import retrieve_knowledge
from app.modules.ai_assistant.application.tool_registry import AssistantTool
from app.modules.ai_assistant.application.types import AssistantGraphState, ToolCallRecord
from app.modules.cart.application.service import add_item_to_cart, build_cart_response, get_cart, update_cart_item
from app.modules.catalog.application.service import hydrate_product_read_model, list_products
from app.modules.catalog.domain.models import Product, ProductVariant
from app.modules.inventory.application.service import get_inventory_item
from app.modules.notifications.application.service import list_notifications, unread_notification_count
from app.modules.orders.domain.models import Order, OrderItem
from app.modules.orders.application.service import list_orders_for_user
from app.modules.returns.application.service import list_returns_for_user
from app.modules.shipping.application.service import get_shipment_for_user


def _product_image(db: Session, product_id: str) -> str | None:
    product = db.scalar(
        select(Product)
        .options(selectinload(Product.media))
        .where(Product.id == product_id)
    )
    if product is None or not product.media:
        return None
    media = sorted(product.media, key=lambda item: item.sort_order)
    return media[0].media_url if media else None


def _order_card(db: Session, order: Order, shipment: object | None = None) -> dict[str, object]:
    return {
        "id": order.id,
        "order_number": order.order_number,
        "status": order.status,
        "currency": order.currency,
        "subtotal": str(order.subtotal),
        "created_at": order.created_at.isoformat(),
        "shipment": (
            {
                "status": getattr(shipment, "status", "pending"),
                "carrier": getattr(shipment, "carrier", "internal"),
                "tracking_number": getattr(shipment, "tracking_number", ""),
                "events": [event.status for event in getattr(shipment, "events", [])[:5]],
            }
            if shipment is not None
            else None
        ),
        "items": [
            {
                "order_item_id": item.id,
                "item_number": item.item_number,
                "product_id": item.product_id,
                "product_name": item.product_name,
                "variant_name": item.variant_name,
                "quantity": item.quantity,
                "unit_price": str(item.unit_price),
                "line_total": str(item.line_total),
                "image": _product_image(db, item.product_id),
            }
            for item in order.items
        ],
    }


class CartAddTool(AssistantTool):
    name = "cart.add_product"
    intent_names = ("cart_help",)

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        if "CART_ADD" not in state.intents or not self._is_add_request(state.prompt):
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="No add-to-cart request detected.")
            )
            return state
        if state.context.user_id is None:
            state.metadata["auth_required"] = True
            state.metadata["cart_action"] = {"status": "auth_required"}
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="Authentication required.")
            )
            return state

        quantity = self._quantity(state)
        variant = self._resolve_variant(db, state)
        if variant is None:
            state.metadata["cart_action"] = {"status": "not_found"}
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="completed", detail="No matching product or SKU found.")
            )
            return state

        product = variant.product
        available = self._available_units(db, variant)
        if available < quantity:
            state.metadata["cart_action"] = {
                "status": "out_of_stock",
                "product_id": product.id,
                "variant_id": variant.id,
                "sku": variant.sku,
                "product_name": product.name,
                "available_quantity": available,
            }
            state.products = [hydrate_product_read_model(db, product)]
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="completed", detail="Product is out of stock.")
            )
            return state

        try:
            add_item_to_cart(
                db,
                user_id=state.context.user_id,
                variant_id=variant.id,
                quantity=quantity,
            )
        except ValueError as exc:
            state.metadata["cart_action"] = {"status": "failed", "message": str(exc)}
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="failed", detail=str(exc))
            )
            return state

        state.products = [hydrate_product_read_model(db, product)]
        state.metadata["cart_action"] = {
            "status": "added",
            "product_id": product.id,
            "variant_id": variant.id,
            "sku": variant.sku,
            "product_name": product.name,
            "quantity": quantity,
        }
        state.metadata["quick_replies"] = ["View cart", "Proceed to checkout", "Find products"]
        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Added {quantity} item(s) for SKU {variant.sku} to cart.",
            )
        )
        return state

    def _is_add_request(self, prompt: str) -> bool:
        return bool(re.search(r"\b(add|put|move)\b.*\b(cart|basket)\b", prompt.lower()))

    def _quantity(self, state: AssistantGraphState) -> int:
        value = state.entities.get("quantity")
        if value not in (None, ""):
            try:
                return max(1, min(10, int(value)))
            except (TypeError, ValueError):
                pass
        match = re.search(r"\b(?:qty|quantity|x)\s*(\d{1,2})\b", state.prompt.lower())
        if match:
            return max(1, min(10, int(match.group(1))))
        return 1

    def _resolve_variant(self, db: Session, state: AssistantGraphState) -> ProductVariant | None:
        candidates = self._identifier_candidates(state)
        for candidate in candidates:
            variant = self._variant_by_identifier(db, candidate)
            if variant is not None:
                return variant

        query = self._product_query(state)
        if not query:
            return None
        products = list_products(db, query=query, published_only=True)
        if isinstance(products, tuple):
            products = products[0]
        for product in products:
            hydrated = hydrate_product_read_model(db, product)
            variant = self._default_variant(hydrated)
            if variant is not None and self._available_units(db, variant) > 0:
                return variant
        return None

    def _identifier_candidates(self, state: AssistantGraphState) -> list[str]:
        values: list[str] = []
        for key in ("sku", "product_id"):
            value = state.entities.get(key)
            if value:
                values.append(str(value))
        uuid_matches = re.findall(
            r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
            state.prompt,
        )
        values.extend(uuid_matches)
        ignored = {
            "ADD",
            "CART",
            "BASKET",
            "PLEASE",
            "PRODUCT",
            "SKU",
            "ITEM",
            "QTY",
            "QUANTITY",
            "REMOVE",
            "DELETE",
            "DROP",
            "FROM",
            "SET",
            "UPDATE",
            "CHANGE",
        }
        tokens = re.findall(r"[A-Z0-9][A-Z0-9_-]{2,}", state.prompt.upper())
        values.extend(token for token in tokens if token not in ignored and not token.startswith(("ORD-", "RET-", "ITM-")))
        deduped: list[str] = []
        for value in values:
            normalized = value.strip()
            if normalized and normalized not in deduped:
                deduped.append(normalized)
        return deduped

    def _variant_by_identifier(self, db: Session, identifier: str) -> ProductVariant | None:
        text = identifier.strip()
        compact = text.replace("_", "-")
        return db.scalar(
            select(ProductVariant)
            .options(
                selectinload(ProductVariant.product).selectinload(Product.media),
                selectinload(ProductVariant.product).selectinload(Product.category),
                selectinload(ProductVariant.product).selectinload(Product.brand),
                selectinload(ProductVariant.inventory_items),
            )
            .join(Product)
            .where(Product.is_deleted.is_(False), Product.is_published.is_(True))
            .where(
                ProductVariant.id == text,
            )
        ) or db.scalar(
            select(ProductVariant)
            .options(
                selectinload(ProductVariant.product).selectinload(Product.media),
                selectinload(ProductVariant.product).selectinload(Product.category),
                selectinload(ProductVariant.product).selectinload(Product.brand),
                selectinload(ProductVariant.inventory_items),
            )
            .join(Product)
            .where(Product.is_deleted.is_(False), Product.is_published.is_(True))
            .where(
                (ProductVariant.sku.ilike(text))
                | (ProductVariant.sku.ilike(compact))
                | (Product.id == text)
                | (Product.slug.ilike(text.lower()))
            )
        )

    def _product_query(self, state: AssistantGraphState) -> str:
        explicit_query = state.entities.get("product_query")
        if explicit_query:
            return str(explicit_query)
        cleaned = re.sub(r"\b(add|put|move|to|into|cart|basket|please|sku|product|item|qty|quantity)\b", " ", state.prompt, flags=re.I)
        cleaned = re.sub(
            r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
            " ",
            cleaned,
        )
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned

    def _default_variant(self, product: Product) -> ProductVariant | None:
        if not product.variants:
            return None
        return next((variant for variant in product.variants if variant.is_default), product.variants[0])

    def _available_units(self, db: Session, variant: ProductVariant) -> int:
        inventory = get_inventory_item(db, variant_id=variant.id)
        if inventory is not None:
            return inventory.available
        return variant.quantity_available


class CartRemoveTool(CartAddTool):
    name = "cart.remove_product"
    intent_names = ("cart_help",)

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        if "CART_REMOVE" not in state.intents or not self._is_remove_request(state.prompt):
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="No remove-from-cart request detected.")
            )
            return state
        if state.context.user_id is None:
            state.metadata["auth_required"] = True
            state.metadata["cart_action"] = {"status": "auth_required"}
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="Authentication required.")
            )
            return state

        variant = self._resolve_variant(db, state)
        if variant is None:
            state.metadata["cart_action"] = {"status": "not_found"}
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="completed", detail="No matching product or SKU found.")
            )
            return state

        product = variant.product
        cart = get_cart(db, user_id=state.context.user_id)
        active_variant_ids = {item.variant_id for item in cart.items if item.status == "active"}
        if variant.id not in active_variant_ids:
            state.metadata["cart_action"] = {
                "status": "not_in_cart",
                "product_id": product.id,
                "variant_id": variant.id,
                "sku": variant.sku,
                "product_name": product.name,
            }
            state.products = [hydrate_product_read_model(db, product)]
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="completed", detail="Product is not in active cart.")
            )
            return state

        try:
            update_cart_item(db, user_id=state.context.user_id, variant_id=variant.id, quantity=0)
        except ValueError as exc:
            state.metadata["cart_action"] = {"status": "failed", "message": str(exc)}
            state.tool_records.append(ToolCallRecord(tool_name=self.name, status="failed", detail=str(exc)))
            return state

        state.metadata["cart_action"] = {
            "status": "removed",
            "product_id": product.id,
            "variant_id": variant.id,
            "sku": variant.sku,
            "product_name": product.name,
        }
        state.metadata["quick_replies"] = ["What is in my cart?", "Find products", "Proceed to checkout"]
        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Removed SKU {variant.sku} from cart.",
            )
        )
        return state

    def _is_remove_request(self, prompt: str) -> bool:
        normalized = prompt.lower()
        return bool(
            re.search(r"\b(remove|delete|drop)\b.*\b(cart|crat|crt|caart|carrt|basket)\b", normalized)
            or re.search(r"\b(cart|crat|crt|caart|carrt|basket)\b.*\b(remove|delete|drop)\b", normalized)
        )


class CartUpdateTool(CartAddTool):
    name = "cart.update_quantity"
    intent_names = ("cart_help",)

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        if "CART_UPDATE" not in state.intents or not self._is_update_request(state.prompt):
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="No cart quantity update detected.")
            )
            return state
        if state.context.user_id is None:
            state.metadata["auth_required"] = True
            state.metadata["cart_action"] = {"status": "auth_required"}
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="Authentication required.")
            )
            return state

        variant = self._resolve_variant(db, state)
        if variant is None:
            state.metadata["cart_action"] = {"status": "not_found"}
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="completed", detail="No matching product or SKU found.")
            )
            return state

        quantity = self._quantity(state)
        product = variant.product
        cart = get_cart(db, user_id=state.context.user_id)
        active_variant_ids = {item.variant_id for item in cart.items if item.status == "active"}
        if variant.id not in active_variant_ids:
            state.metadata["cart_action"] = {
                "status": "not_in_cart",
                "product_id": product.id,
                "variant_id": variant.id,
                "sku": variant.sku,
                "product_name": product.name,
            }
            state.products = [hydrate_product_read_model(db, product)]
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="completed", detail="Product is not in active cart.")
            )
            return state

        try:
            update_cart_item(db, user_id=state.context.user_id, variant_id=variant.id, quantity=quantity)
        except ValueError as exc:
            state.metadata["cart_action"] = {"status": "failed", "message": str(exc)}
            state.tool_records.append(ToolCallRecord(tool_name=self.name, status="failed", detail=str(exc)))
            return state

        state.metadata["cart_action"] = {
            "status": "updated" if quantity > 0 else "removed",
            "product_id": product.id,
            "variant_id": variant.id,
            "sku": variant.sku,
            "product_name": product.name,
            "quantity": quantity,
        }
        state.metadata["quick_replies"] = ["What is in my cart?", "Proceed to checkout", "Find products"]
        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Updated SKU {variant.sku} cart quantity to {quantity}.",
            )
        )
        return state

    def _is_update_request(self, prompt: str) -> bool:
        normalized = prompt.lower()
        return bool(
            re.search(r"\b(set|update|change)\b.*\b(qty|quantity)\b", normalized)
            or re.search(r"\b(qty|quantity)\b.*\b(set|update|change)\b", normalized)
        )

    def _quantity(self, state: AssistantGraphState) -> int:
        value = state.entities.get("quantity")
        if value not in (None, ""):
            try:
                return max(0, min(20, int(value)))
            except (TypeError, ValueError):
                pass
        match = re.search(r"\b(?:qty|quantity|x)\s*(\d{1,2})\b", state.prompt.lower())
        if match:
            return max(0, min(20, int(match.group(1))))
        return 1


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
        cart_model = get_cart(db, user_id=state.context.user_id)
        active_cart_items = [item for item in cart_model.items if item.status == "active"]
        cart_products: list[Product] = []
        seen_product_ids: set[str] = set()
        for item in active_cart_items:
            product = item.variant.product
            if product.id in seen_product_ids:
                continue
            seen_product_ids.add(product.id)
            cart_products.append(hydrate_product_read_model(db, product))
        state.metadata["cart"] = {
            "total_items": cart.total_items,
            "subtotal": str(cart.subtotal),
            "currency": cart.currency,
            "items": [
                {
                    "product_id": item.variant.product.id,
                    "variant_id": item.variant_id,
                    "product_name": item.product_name,
                    "variant_name": item.variant_name,
                    "sku": item.sku,
                    "quantity": item.quantity,
                    "unit_price": str(item.unit_price),
                    "line_total": str(item.line_total),
                    "currency": item.currency,
                }
                for item in cart.items[:10]
            ],
        }
        state.products = cart_products[:10]
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
        filtered_orders = self._filter_orders(state, orders)
        limit = self._requested_limit_for_state(state, default=1 if state.intent == "shipping_support" else 3)
        selected_orders = filtered_orders[:limit]
        order_cards = [_order_card(db, order) for order in selected_orders]
        state.metadata["orders"] = [
            {
                "id": order.id,
                "order_number": order.order_number,
                "status": order.status,
                "subtotal": str(order.subtotal),
                "created_at": order.created_at.isoformat(),
            }
            for order in selected_orders
        ]
        state.metadata["order_cards"] = order_cards
        state.metadata["order_lookup"] = {
            "requested_limit": limit,
            "returned_count": len(selected_orders),
            "status_filter": self._requested_status_for_state(state),
        }
        if state.intent == "shipping_support":
            state.metadata["quick_replies"] = ["I received a damaged item", "Show my recent orders"]
        state.tool_records.append(
            ToolCallRecord(tool_name=self.name, status="completed", detail=f"Loaded {len(selected_orders)} matching orders.")
        )
        return state

    def _requested_limit_for_state(self, state: AssistantGraphState, *, default: int) -> int:
        value = state.entities.get("requested_limit")
        if value not in (None, ""):
            try:
                return max(1, min(10, int(value)))
            except (TypeError, ValueError):
                pass
        return self._requested_limit(state.prompt, default=default)

    def _requested_limit(self, prompt: str, *, default: int) -> int:
        normalized = prompt.lower()
        words = {
            "one": 1,
            "two": 2,
            "three": 3,
            "four": 4,
            "five": 5,
        }
        digit_match = re.search(r"\b(?:last|latest|recent|show|get|my)?\s*(\d{1,2})\b", normalized)
        if digit_match:
            return max(1, min(10, int(digit_match.group(1))))
        for word, value in words.items():
            if re.search(rf"\b{word}\b", normalized):
                return value
        if any(token in normalized for token in ("orders", "recent orders", "all orders")):
            return max(default, 3)
        return default

    def _requested_status(self, prompt: str) -> str | None:
        normalized = prompt.lower().replace("-", " ")
        status_terms = {
            "delivered": "delivered",
            "shipped": "shipped",
            "packed": "packed",
            "processing": "processing",
            "confirmed": "confirmed",
            "pending": "pending",
            "cancelled": "cancelled",
            "canceled": "cancelled",
            "out for delivery": "out_for_delivery",
        }
        for term, status in status_terms.items():
            if term in normalized:
                return status
        return None

    def _requested_status_for_state(self, state: AssistantGraphState) -> str | None:
        status = state.entities.get("status_filter")
        if status:
            return str(status).lower().replace("-", "_").replace(" ", "_")
        if state.intent == "return_support":
            return "delivered"
        return self._requested_status(state.prompt)

    def _filter_orders(self, state: AssistantGraphState, orders: list[Order]) -> list[Order]:
        status = self._requested_status_for_state(state)
        if status is None:
            return orders
        if status == "delivered":
            return [
                order
                for order in orders
                if order.status in {"delivered", "partially_delivered"}
                or any(item.status == "delivered" for item in order.items)
            ]
        return [
            order
            for order in orders
            if order.status == status or any(item.status == status for item in order.items)
        ]


class ShipmentStatusTool(AssistantTool):
    name = "shipping.status"
    intent_names = ("shipping_support",)

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        orders = state.metadata.get("orders", [])
        lookup = state.metadata.get("order_lookup", {})
        if isinstance(lookup, dict) and int(lookup.get("returned_count") or 0) > 1:
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="Multiple orders requested.")
            )
            return state
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
        order = db.get(Order, order_id)
        if order is not None:
            cards = state.metadata.get("order_cards", [])
            updated_card = _order_card(db, order, shipment)
            state.metadata["order_cards"] = [
                updated_card if isinstance(card, dict) and card.get("id") == order.id else card
                for card in cards
            ] or [updated_card]
        state.tool_records.append(
            ToolCallRecord(tool_name=self.name, status="completed", detail=f"Loaded shipment status {shipment.status}.")
        )
        return state


class ReturnPolicyTool(AssistantTool):
    name = "knowledge.return_policy"
    intent_names = ("return_support", "policy_help")

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        query = f"returns {state.prompt}" if state.intent == "return_support" else state.prompt
        docs = retrieve_knowledge(db, query=query, limit=3)
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
        return_requests = list_returns_for_user(db, user_id=state.context.user_id)
        ticket = self._match_return_ticket(state.prompt, state.entities, return_requests)
        if ticket is not None:
            order = db.get(Order, ticket.order_id)
            item = db.get(OrderItem, ticket.order_item_id)
            lifecycle_status = self._ticket_lifecycle(ticket.status)
            state.metadata["orders"] = []
            state.metadata["order_cards"] = []
            state.metadata["return_ticket"] = {
                "id": ticket.id,
                "reference_id": self._ticket_reference(ticket.id),
                "status": ticket.status,
                "lifecycle_status": lifecycle_status,
                "order_id": ticket.order_id,
                "order_number": order.order_number if order is not None else "",
                "order_item_id": ticket.order_item_id,
                "product_name": item.product_name if item is not None else "Order item",
                "reason": ticket.reason,
                "issue_reason": ticket.issue_reason,
                "proof_type": ticket.proof_type,
                "replacement_product_id": ticket.replacement_product_id,
            }
            state.metadata["quick_replies"] = ["Track my latest order", "Show my returns", "Contact support"]
            state.confirmation_required = False
            state.tool_records.append(
                ToolCallRecord(
                    tool_name=self.name,
                    status="completed",
                    detail=f"Loaded return ticket {self._ticket_reference(ticket.id)}.",
                )
            )
            return state

        if any(token in state.prompt.lower() for token in ("ticket", "return status", "request status", "reference")):
            state.metadata["orders"] = []
            state.metadata["order_cards"] = []
            state.metadata["return_tickets"] = [
                {
                    "id": request.id,
                    "reference_id": self._ticket_reference(request.id),
                    "status": request.status,
                    "lifecycle_status": self._ticket_lifecycle(request.status),
                    "reason": request.reason,
                    "created_at": request.created_at.isoformat(),
                }
                for request in return_requests[:3]
            ]
            state.metadata["quick_replies"] = ["Track my latest order", "Show my delivered orders", "Contact support"]
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="completed", detail="Loaded recent return tickets.")
            )
            return state

        order = self._match_order(db, state.prompt, orders, state.entities)
        if order is None:
            eligible_orders = self._return_eligible_orders(orders)
            state.metadata["orders"] = [
                {
                    "id": item.id,
                    "order_number": item.order_number,
                    "status": item.status,
                    "subtotal": str(item.subtotal),
                    "created_at": item.created_at.isoformat(),
                }
                for item in eligible_orders[:3]
            ]
            state.metadata["order_cards"] = [_order_card(db, item) for item in eligible_orders[:3]]
            state.metadata["return_workflow"] = {
                "status": "needs_order_id",
                "message": (
                    "Ask the customer to choose one delivered order before starting a return or replacement."
                    if eligible_orders
                    else "No delivered orders are currently eligible for return or replacement."
                ),
                "recent_orders": [
                    {
                        "id": item.id,
                        "order_number": item.order_number,
                        "status": item.status,
                        "created_at": item.created_at.isoformat(),
                    }
                    for item in eligible_orders[:3]
                ],
            }
            state.metadata["quick_replies"] = [
                "Show my delivered orders",
                "Track my latest order",
                "Check return policy",
            ]
            state.confirmation_required = True
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="completed", detail="Return workflow needs order ID.")
            )
            return state

        eligible = order.status in {"delivered", "returned", "partially_returned"}
        target_item = self._match_order_item(state.prompt, order, state.entities)
        needs_item_choice = target_item is None and len(order.items) > 1
        existing_returns = [
            request
            for request in return_requests
            if request.order_id == order.id
            and target_item is not None
            and request.order_item_id == target_item.id
        ]
        items = [
            {
                "order_item_id": item.id,
                "product_id": item.product_id,
                "product_name": item.product_name,
                "quantity": item.quantity,
                "unit_price": str(item.unit_price),
                "image": _product_image(db, item.product_id),
            }
            for item in order.items
        ]

        candidate_items = [target_item] if target_item is not None else list(order.items)
        replacement_items = [
            item for item in candidate_items if self._order_item_replacement_available(db, item.product_id)
        ]
        replacement_available = bool(replacement_items)
        similar_products = (
            self._similar_products(db, target_item)
            if target_item is not None and not replacement_available
            else []
        )
        if similar_products and not state.products:
            state.products = similar_products

        if eligible:
            next_actions = ["Request a refund", "Contact support"]
            if replacement_available:
                next_actions.insert(0, "Replace this item" if target_item is not None else "Choose item to replace")
            elif similar_products:
                next_actions.insert(0, "Choose a similar product")
        else:
            next_actions = ["Track delivery", "Contact support", "Check return policy"]

        state.metadata["return_workflow"] = {
            "status": "verified",
            "eligible": eligible,
            "damage_intake": {
                "available": eligible,
                "requires_delivery": not eligible,
                "required_details": [
                    "damaged item name",
                    "damage reason",
                    "clear photo or video proof",
                    "packaging condition",
                ],
            },
            "needs_item_choice": needs_item_choice,
            "replacement_available": replacement_available,
            "similar_product_count": len(similar_products),
            "target_item": (
                {
                    "order_item_id": target_item.id,
                    "product_id": target_item.product_id,
                    "product_name": target_item.product_name,
                }
                if target_item is not None
                else None
            ),
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
                    "reference_id": self._ticket_reference(request.id),
                    "order_item_id": request.order_item_id,
                    "quantity": request.quantity,
                    "reason": request.reason,
                    "status": request.status,
                    "lifecycle_status": self._ticket_lifecycle(request.status),
                }
                for request in existing_returns
            ],
            "next_actions": next_actions,
        }
        return_actions = []
        if eligible and needs_item_choice:
            return_actions.extend(
                [
                    {
                        "label": f"Select {item.product_name}",
                        "description": "Choose this product if it arrived damaged.",
                        "enabled": True,
                        "action": "message",
                        "order_item_id": item.id,
                        "product_name": item.product_name,
                    }
                    for item in order.items
                ]
            )
        elif eligible:
            return_actions.extend(
                [
                    {
                        "label": "Item is broken or cracked",
                        "description": "Choose this reason if the product has visible physical damage.",
                        "enabled": True,
                        "action": "reason",
                        "issue_reason": "Item is broken or cracked",
                    },
                    {
                        "label": "Product is not working",
                        "description": "Choose this reason if the item powers on poorly or does not work.",
                        "enabled": True,
                        "action": "reason",
                        "issue_reason": "Product is not working",
                    },
                    {
                        "label": "Package arrived damaged",
                        "description": "Choose this reason if the box or outer packaging was damaged.",
                        "enabled": True,
                        "action": "reason",
                        "issue_reason": "Package arrived damaged",
                    },
                ]
            )
            for item in replacement_items[:3]:
                return_actions.append(
                    {
                        "label": f"Replace {item.product_name}",
                        "description": "Choose this if you want the same item sent again.",
                        "enabled": True,
                        "action": "replacement",
                        "order_item_id": item.id,
                        "quantity": 1,
                        "product_name": item.product_name,
                        "proof_required": True,
                    }
                )
            if similar_products:
                return_actions.append(
                    {
                        "label": "Choose a similar product",
                        "description": "Pick from similar in-stock products shown below.",
                        "enabled": True,
                    }
                )
            return_actions.append(
                {
                    "label": "Request a refund",
                    "description": "Choose this if you prefer money back according to the return policy.",
                    "enabled": True,
                    "action": "refund",
                    "order_item_id": target_item.id if target_item is not None else (order.items[0].id if order.items else None),
                    "quantity": 1,
                    "proof_required": True,
                }
            )
        else:
            return_actions.extend(
                [
                    {
                        "label": "Order not delivered yet",
                        "description": "Damage replacement or refund starts after delivery is completed.",
                        "enabled": False,
                    },
                    {
                        "label": "Keep photo or video proof",
                        "description": "After delivery, keep clear proof of the item and packaging.",
                        "enabled": False,
                    },
                    {
                        "label": "Track delivery",
                        "description": "Check the current delivery status for this order.",
                        "enabled": True,
                        "action": "message",
                    },
                ]
            )
        state.metadata["order_cards"] = [_order_card(db, order)]
        state.metadata["return_actions"] = return_actions
        state.metadata["quick_replies"] = (
            ["Contact support", "Check return policy"]
            if eligible
            else state.metadata["return_workflow"]["next_actions"]
        )
        state.confirmation_required = eligible
        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Verified return workflow for order {order.order_number}.",
            )
        )
        return state

    def _return_eligible_orders(self, orders: list[Order]) -> list[Order]:
        return [
            order
            for order in orders
            if order.status in {"delivered", "returned", "partially_returned", "partially_delivered"}
            or any(item.status == "delivered" for item in order.items)
        ]

    def _match_return_ticket(self, prompt: str, entities: dict[str, object], requests: list[object]):
        ticket = str(entities.get("return_ticket_id") or "").upper().strip()
        if not ticket:
            match = re.search(r"\bRET-[A-Z0-9]+\b", prompt.upper())
            ticket = match.group(0) if match else ""
        if not ticket.startswith("RET-"):
            return None
        compact_ticket = ticket.removeprefix("RET-").replace("-", "")
        for request in requests:
            compact_id = str(request.id).replace("-", "").upper()
            if compact_id.startswith(compact_ticket):
                return request
        return None

    def _ticket_reference(self, return_id: str) -> str:
        return f"RET-{return_id.replace('-', '')[:8].upper()}"

    def _ticket_lifecycle(self, status: str) -> str:
        return "open" if status in {"requested", "reviewing", "pending"} else "closed"

    def _match_order(
        self,
        db: Session,
        prompt: str,
        orders: list[Order],
        entities: dict[str, object] | None = None,
    ) -> Order | None:
        candidates = self._id_candidates(prompt, entities)
        for order in orders:
            if order.order_number.upper() in candidates or order.id.upper() in candidates:
                return order
            for item in order.items:
                item_number = (item.item_number or "").upper()
                if (
                    item.id.upper() in candidates
                    or item.product_id.upper() in candidates
                    or (item_number and item_number in candidates)
                ):
                    return order

        uuid_match = re.search(
            r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
            prompt,
        )
        if uuid_match:
            matched_id = uuid_match.group(0)
            for order in orders:
                if order.id == matched_id or any(item.id == matched_id or item.product_id == matched_id for item in order.items):
                    return order

        prompt_lower = prompt.lower()
        if orders and any(token in prompt_lower for token in ("damage", "damaged", "broken", "defective", "received")):
            delivered_orders = [
                order
                for order in orders
                if order.status in {"delivered", "returned", "partially_returned"}
                or any(item.status == "delivered" for item in order.items)
            ]
            if delivered_orders:
                return delivered_orders[0]
            return orders[0]
        if len(orders) == 1 and any(token in prompt_lower for token in ("latest", "last", "recent", "this order")):
            return orders[0]
        return None

    def _match_order_item(
        self,
        prompt: str,
        order: Order,
        entities: dict[str, object] | None = None,
    ) -> OrderItem | None:
        candidates = self._id_candidates(prompt, entities)
        for item in order.items:
            item_number = (item.item_number or "").upper()
            if (
                item.id.upper() in candidates
                or item.product_id.upper() in candidates
                or (item_number and item_number in candidates)
            ):
                return item

        uuid_match = re.search(
            r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
            prompt,
        )
        if uuid_match:
            matched_id = uuid_match.group(0)
            for item in order.items:
                if item.id == matched_id or item.product_id == matched_id:
                    return item

        prompt_terms = {
            term
            for term in re.findall(r"[a-z0-9]+", prompt.lower())
            if len(term) > 2 and term not in {"item", "product", "replace", "return", "refund", "damaged", "damage", "broken", "received"}
        }
        if not prompt_terms:
            return order.items[0] if len(order.items) == 1 else None

        best_item: OrderItem | None = None
        best_score = 0
        for item in order.items:
            item_terms = set(re.findall(r"[a-z0-9]+", item.product_name.lower()))
            score = len(prompt_terms & item_terms)
            if score > best_score:
                best_item = item
                best_score = score
        return best_item if best_score > 0 else (order.items[0] if len(order.items) == 1 else None)

    def _id_candidates(self, prompt: str, entities: dict[str, object] | None = None) -> set[str]:
        candidates = set(re.findall(r"[A-Z0-9][A-Z0-9-]{5,}", prompt.upper()))
        if entities:
            for key in ("order_id", "order_item_id", "product_id"):
                value = entities.get(key)
                if value:
                    candidates.add(str(value).upper())
        return candidates | {
            f"ORD-{candidate[5:]}"
            for candidate in candidates
            if candidate.startswith("WORD-") and len(candidate) > 5
        }

    def _order_item_replacement_available(self, db: Session, product_id: str) -> bool:
        product = db.get(Product, product_id)
        if product is None or not product.is_published or product.is_deleted:
            return False
        hydrated = hydrate_product_read_model(db, product)
        return self._available_units(hydrated) > 0

    def _similar_products(self, db: Session, item: OrderItem) -> list[Product]:
        source = db.get(Product, item.product_id)
        if source is None:
            return []
        source_price = Decimal(item.unit_price)
        narrow_min = max(Decimal("0"), source_price * Decimal("0.85"))
        narrow_max = source_price * Decimal("1.15")
        wide_min = max(Decimal("0"), source_price * Decimal("0.70"))
        wide_max = source_price * Decimal("1.30")
        products = list_products(
            db,
            published_only=True,
            category_slugs=[source.category.slug] if source.category else None,
        )
        similar: list[Product] = []
        for product in products:
            if product.id == source.id:
                continue
            hydrated = hydrate_product_read_model(db, product)
            if self._available_units(hydrated) <= 0:
                continue
            product_price = self._default_price(hydrated)
            if product_price is None or not narrow_min <= product_price <= narrow_max:
                continue
            similar.append(hydrated)
            if len(similar) >= 4:
                break
        if similar:
            return sorted(similar, key=lambda product: abs((self._default_price(product) or source_price) - source_price))

        fallback: list[Product] = []
        for product in products:
            if product.id == source.id:
                continue
            hydrated = hydrate_product_read_model(db, product)
            if self._available_units(hydrated) <= 0:
                continue
            product_price = self._default_price(hydrated)
            if product_price is None or not wide_min <= product_price <= wide_max:
                continue
            fallback.append(hydrated)
        fallback.sort(key=lambda product: abs((self._default_price(product) or source_price) - source_price))
        return fallback[:4]

    def _available_units(self, product: Product) -> int:
        return sum(max(0, variant.quantity_available) for variant in product.variants)

    def _default_price(self, product: Product) -> Decimal | None:
        if not product.variants:
            return None
        default_variant = next((variant for variant in product.variants if variant.is_default), product.variants[0])
        return Decimal(default_variant.price)


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
