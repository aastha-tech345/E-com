from __future__ import annotations

import re
from decimal import Decimal

from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.tool_registry import AssistantTool
from app.modules.ai_assistant.application.types import AssistantGraphState, ToolCallRecord
from app.modules.catalog.application.service import hydrate_product_read_model, list_products
from app.modules.catalog.domain.models import Product


SEARCH_STOP_WORDS = {
    "a",
    "about",
    "all",
    "and",
    "any",
    "best",
    "buy",
    "find",
    "for",
    "give",
    "i",
    "in",
    "item",
    "items",
    "me",
    "need",
    "please",
    "product",
    "products",
    "search",
    "show",
    "some",
    "suggest",
    "to",
    "want",
    "with",
}

SEARCH_SYNONYMS = {
    "camers": "camera",
    "cameras": "camera",
    "dslr": "camera",
    "mobile": "phone",
    "mobiles": "phone",
    "smartphone": "phone",
    "smartphones": "phone",
    "watch": "watch",
    "watches": "watch",
    "headphone": "headset",
    "headphones": "headset",
    "earphone": "earbuds",
    "earphones": "earbuds",
}


class CatalogSearchTool(AssistantTool):
    name = "catalog.search_products"
    intent_names = ("product_search", "product_compare", "product_recommendation")

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        query = _clean_query(state.prompt)
        max_price = _extract_max_price(state.prompt)
        products = _search_products(db, state.prompt, query=query, max_price=max_price)
        matches = [hydrate_product_read_model(db, product) for product in products[:6]]

        if matches or not state.products:
            state.products = matches
            state.metadata["search_method"] = "catalog"
            state.metadata["normalized_query"] = query
            if max_price is not None:
                state.metadata["max_price"] = str(max_price)

        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Retrieved {len(matches)} catalog product matches.",
            )
        )
        return state


def _search_products(db: Session, raw_prompt: str, *, query: str, max_price: Decimal | None) -> list[Product]:
    exact_matches = list_products(db, query=query or raw_prompt, published_only=True, max_price=max_price)
    if exact_matches:
        return exact_matches

    tokens = _query_tokens(query or raw_prompt)
    if not tokens:
        return []

    candidates = list_products(db, published_only=True, max_price=max_price)
    scored = [
        (product, _score_product(product, tokens))
        for product in candidates
    ]
    scored = [(product, score) for product, score in scored if score > 0]
    scored.sort(key=lambda item: item[1], reverse=True)
    return [product for product, _ in scored]


def _clean_query(prompt: str) -> str:
    lowered = prompt.lower()
    lowered = re.sub(r"\b(under|below|less than|upto|up to)\s*(rs\.?|inr|₹)?\s*\d+(?:,\d+)*(?:\.\d+)?", " ", lowered)
    lowered = re.sub(r"[^\w\s-]", " ", lowered)
    tokens = []
    for token in lowered.split():
        normalized = SEARCH_SYNONYMS.get(token, token)
        if normalized not in SEARCH_STOP_WORDS:
            tokens.append(normalized)
    return " ".join(tokens).strip()


def _query_tokens(prompt: str) -> set[str]:
    return {
        SEARCH_SYNONYMS.get(token, token)
        for token in re.findall(r"[a-z0-9]+", prompt.lower())
        if token not in SEARCH_STOP_WORDS and len(token) > 1
    }


def _extract_max_price(prompt: str) -> Decimal | None:
    match = re.search(r"\b(?:under|below|less than|upto|up to)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:,\d+)*(?:\.\d+)?)", prompt.lower())
    if not match:
        return None
    try:
        return Decimal(match.group(1).replace(",", ""))
    except Exception:
        return None


def _score_product(product: Product, tokens: set[str]) -> int:
    searchable = " ".join(
        [
            product.name or "",
            product.short_description or "",
            product.description or "",
            product.slug or "",
            product.category.name if product.category else "",
            product.brand.name if product.brand else "",
            " ".join(variant.sku or "" for variant in product.variants),
            " ".join(variant.name or "" for variant in product.variants),
        ]
    ).lower()
    searchable_tokens = _query_tokens(searchable)
    score = len(tokens & searchable_tokens)
    for token in tokens:
        if token in searchable:
            score += 1
    return score
