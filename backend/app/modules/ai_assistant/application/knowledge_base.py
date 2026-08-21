from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class SeedKnowledgeDocument:
    slug: str
    title: str
    category: str
    content: str


SEED_KNOWLEDGE_DOCUMENTS: tuple[SeedKnowledgeDocument, ...] = (
    SeedKnowledgeDocument(
        slug="returns-policy",
        title="Returns and Refund Policy",
        category="returns",
        content=(
            "Customers can request returns after delivery for eligible items. "
            "Return requests must match the purchased quantity and are reviewed before approval. "
            "Approved returns trigger a refund to the original payment and restock the inventory. "
            "Rejected returns do not create a refund."
        ),
    ),
    SeedKnowledgeDocument(
        slug="shipping-help",
        title="Shipping and Delivery Help",
        category="shipping",
        content=(
            "Orders are created with a shipment record and a pending tracking event. "
            "Shipment status updates notify the customer and also update the order status history. "
            "Delivered orders are eligible for post-delivery returns according to return rules."
        ),
    ),
    SeedKnowledgeDocument(
        slug="catalog-help",
        title="Catalog Discovery Guidance",
        category="catalog",
        content=(
            "Use search terms around category, use case, budget, fabric, occasion, brand, or style. "
            "Popular searches and related products can help broaden discovery when exact matches are unavailable."
        ),
    ),
    SeedKnowledgeDocument(
        slug="cart-checkout-help",
        title="Cart and Checkout Help",
        category="cart",
        content=(
            "The cart reserves inventory while quantities are active. "
            "Checkout creates the order, captures payment, creates shipment records, and clears the cart. "
            "Inventory is committed only during order placement."
        ),
    ),
)
