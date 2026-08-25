"""Semantic search tool for product discovery used by the LangGraph assistant."""

from __future__ import annotations

import re

from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.tool_registry import AssistantTool
from app.modules.ai_assistant.application.types import AssistantGraphState, ToolCallRecord
from app.modules.catalog.application.service import hydrate_product_read_model, list_products
from app.modules.catalog.domain.models import Product


class SimpleEmbeddings:
    """Simple embedding implementation using keyword matching for demo.
    
    In production, replace with OpenAI embeddings or similar.
    """

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        """Create embeddings for documents."""
        embeddings = []
        for text in texts:
            # Simple keyword-based embedding (TF-IDF-like)
            words = text.lower().split()
            embedding = self._create_embedding_vector(words)
            embeddings.append(embedding)
        return embeddings

    def embed_query(self, text: str) -> list[float]:
        """Create embedding for query."""
        words = text.lower().split()
        return self._create_embedding_vector(words)

    def _create_embedding_vector(self, words: list[str]) -> list[float]:
        """Create a simple vector representation from words."""
        # Create a 100-dimensional vector
        vector = [0.0] * 100
        for i, word in enumerate(words[:100]):
            # Hash word to position
            hash_val = hash(word) % 100
            vector[hash_val] += (1.0 / (i + 1))  # TF-like weighting
        # Normalize
        magnitude = sum(x**2 for x in vector) ** 0.5
        if magnitude > 0:
            vector = [x / magnitude for x in vector]
        return vector


class LangChainSemanticSearchTool(AssistantTool):
    """Dependency-free semantic search tool.

    The class name is kept stable because the orchestrator already imports it.
    LangGraph owns the assistant orchestration; this tool only ranks products.
    """

    name = "catalog.semantic_search"
    intent_names = ("product_search", "product_compare", "product_recommendation")

    def __init__(self):
        super().__init__()
        self.embeddings = SimpleEmbeddings()
        self.chunk_size = 500
        self.chunk_overlap = 50

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        """Run semantic search using LangChain."""
        try:
            # Get all products
            all_products = list_products(db, published_only=True)

            # Create product documents with metadata
            product_documents = self._create_product_documents(all_products)

            # Split product descriptions into chunks
            chunks = []
            for product, doc_text in product_documents:
                split_texts = self._split_text(doc_text)
                for chunk in split_texts:
                    chunks.append((product, chunk))

            # Query expansion - add synonyms and related terms
            expanded_query = self._expand_query(state.prompt)

            query_terms = self._tokenize(expanded_query)

            # Score and rank chunks
            ranked_chunks = self._score_chunks(chunks, query_terms)

            # Get unique products from top chunks, limiting to 6
            unique_products = []
            seen_ids = set()
            for product, chunk, score in ranked_chunks:
                if product.id not in seen_ids and len(unique_products) < 6:
                    unique_products.append((product, score))
                    seen_ids.add(product.id)

            # Hydrate products
            matches = [
                hydrate_product_read_model(db, product)
                for product, _ in unique_products
            ]

            if matches:
                state.products = matches
                state.metadata["search_method"] = "semantic"
                state.metadata["expanded_query"] = expanded_query
                state.metadata["search_scores"] = [score for _, score in unique_products]

            state.tool_records.append(
                ToolCallRecord(
                    tool_name=self.name,
                    status="completed",
                    detail=f"Retrieved {len(matches)} products using semantic search. Query expanded from '{state.prompt}' to '{expanded_query}'.",
                )
            )

        except Exception as e:
            state.tool_records.append(
                ToolCallRecord(
                    tool_name=self.name,
                    status="failed",
                    detail=f"Semantic search failed: {str(e)}",
                )
            )

        return state

    def _create_product_documents(self, products: list[Product]) -> list[tuple[Product, str]]:
        """Create searchable documents from products."""
        documents = []
        for product in products:
            # Combine all product info into a searchable document
            doc_parts = [
                f"Product: {product.name}",
                f"Description: {product.description or ''}",
                f"Category: {product.category.name if product.category else ''}",
                f"Brand: {product.brand.name if product.brand else ''}",
                f"SKU: {product.sku or ''}",
                f"Tags: {' '.join([v.name for v in product.variants])}",
            ]
            doc_text = " ".join(filter(None, doc_parts))
            documents.append((product, doc_text))

        return documents

    def _expand_query(self, query: str) -> str:
        """Expand query with synonyms and related terms."""
        query_lower = query.lower()

        # Define synonym mappings
        synonyms = {
            "phone": ["mobile", "smartphone", "device", "handset"],
            "laptop": ["computer", "notebook", "pc", "device"],
            "watch": ["smartwatch", "timepiece", "wearable"],
            "shoe": ["footwear", "sneaker", "boot"],
            "dress": ["gown", "outfit", "apparel"],
            "cheap": ["affordable", "budget", "inexpensive"],
            "expensive": ["premium", "luxury", "high-end"],
            "fast": ["quick", "speedy", "rapid"],
            "slow": ["sluggish", "delayed"],
            "big": ["large", "huge", "oversized"],
            "small": ["tiny", "compact", "mini"],
        }

        expanded = query_lower
        for term, synonyms_list in synonyms.items():
            if term in query_lower:
                expanded += " " + " ".join(synonyms_list)

        return expanded

    def _split_text(self, text: str) -> list[str]:
        """Split text into overlapping chunks without external dependencies."""
        normalized = " ".join(text.split())
        if not normalized:
            return []
        if len(normalized) <= self.chunk_size:
            return [normalized]

        chunks: list[str] = []
        step = max(1, self.chunk_size - self.chunk_overlap)
        for start in range(0, len(normalized), step):
            chunk = normalized[start:start + self.chunk_size].strip()
            if chunk:
                chunks.append(chunk)
            if start + self.chunk_size >= len(normalized):
                break
        return chunks

    def _score_chunks(
        self,
        chunks: list[tuple[Product, str]],
        query_terms: set[str],
    ) -> list[tuple[Product, str, float]]:
        """Score chunks based on deterministic query-token overlap."""
        scored = []
        if not query_terms:
            return scored

        for product, chunk in chunks:
            chunk_terms = self._tokenize(chunk)
            overlap = query_terms & chunk_terms
            if not overlap:
                continue
            score = len(overlap) / max(1, len(query_terms))
            exact_boost = sum(0.15 for term in query_terms if term in chunk.lower())
            scored.append((product, chunk, score + exact_boost))

        # Sort by score descending
        scored.sort(key=lambda x: x[2], reverse=True)
        return scored

    def _tokenize(self, text: str) -> set[str]:
        stop_words = {
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
        synonyms = {
            "camers": "camera",
            "cameras": "camera",
            "dslr": "camera",
            "mobile": "phone",
            "mobiles": "phone",
            "smartphone": "phone",
            "smartphones": "phone",
            "headphone": "headset",
            "headphones": "headset",
            "earphone": "earbuds",
            "earphones": "earbuds",
            "watches": "watch",
        }
        return {
            synonyms.get(token, token)
            for token in re.findall(r"[a-z0-9]+", text.lower())
            if token not in stop_words and len(token) > 1
        }

    def _cosine_similarity(self, vec1: list[float], vec2: list[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        if len(vec1) != len(vec2):
            return 0.0

        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = sum(x**2 for x in vec1) ** 0.5
        magnitude2 = sum(x**2 for x in vec2) ** 0.5

        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0

        return dot_product / (magnitude1 * magnitude2)
