"""Admin policy ingestion using Hugging Face embeddings."""

from __future__ import annotations

import json
import hashlib
import math
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.modules.ai_assistant.domain.models import AIKnowledgeChunk, AIKnowledgeDocument

MAX_POLICY_BYTES = 2 * 1024 * 1024
CHUNK_SIZE = 900
CHUNK_OVERLAP = 150


def _chunks(content: str) -> list[str]:
    text = " ".join(content.split())
    if not text:
        raise ValueError("The policy file is empty.")
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = min(len(text), start + CHUNK_SIZE)
        if end < len(text):
            end = text.rfind(" ", start, end) or end
        chunks.append(text[start:end].strip())
        if end >= len(text):
            break
        start = max(start + 1, end - CHUNK_OVERLAP)
    return chunks


def _local_embed(chunks: list[str]) -> list[list[float]]:
    """Deterministic development fallback when the hosted provider is unavailable."""
    vectors: list[list[float]] = []
    for chunk in chunks:
        vector = [0.0] * 128
        for token in chunk.lower().split():
            index = int(hashlib.sha256(token.encode()).hexdigest(), 16) % len(vector)
            vector[index] += 1.0
        magnitude = math.sqrt(sum(value * value for value in vector)) or 1.0
        vectors.append([value / magnitude for value in vector])
    return vectors


def _embed(chunks: list[str]) -> tuple[list[list[float]], str]:
    headers = {"Content-Type": "application/json"}
    if settings.huggingface_api_token:
        headers["Authorization"] = f"Bearer {settings.huggingface_api_token}"
    request = Request(
        f"{settings.huggingface_embedding_endpoint.rstrip('/')}/{settings.huggingface_embedding_model}",
        data=json.dumps({"inputs": chunks, "options": {"wait_for_model": True}}).encode(),
        headers=headers,
        method="POST",
    )
    try:
        with urlopen(request, timeout=45) as response:  # nosec B310 - fixed HTTPS Hugging Face endpoint
            payload = json.loads(response.read().decode())
    except (HTTPError, URLError, TimeoutError):
        return _local_embed(chunks), "local-hash-fallback"
    if isinstance(payload, dict) and payload.get("error"):
        return _local_embed(chunks), "local-hash-fallback"
    if not isinstance(payload, list) or len(payload) != len(chunks):
        return _local_embed(chunks), "local-hash-fallback"
    vectors: list[list[float]] = []
    for vector in payload:
        # Feature-extraction models can return token embeddings; mean-pool them.
        if vector and isinstance(vector[0], list):
            vector = [sum(values) / len(values) for values in zip(*vector)]
        vectors.append([float(value) for value in vector])
    return vectors, settings.huggingface_embedding_model


def ingest_policy(db: Session, *, filename: str, content: str) -> tuple[AIKnowledgeDocument, int]:
    chunks = _chunks(content)
    embeddings, embedding_model = _embed(chunks)
    title = Path(filename).stem.replace("_", " ").replace("-", " ").title() or "Policy"
    document = AIKnowledgeDocument(
        slug=f"policy-{uuid4().hex}", title=title[:160], category="policy", content=content, source="admin_upload"
    )
    db.add(document)
    db.flush()
    for index, (chunk, embedding) in enumerate(zip(chunks, embeddings, strict=True)):
        db.add(AIKnowledgeChunk(
            document_id=document.id, chunk_index=index, heading=title[:160], content=chunk,
            metadata_json=json.dumps({"embedding": embedding, "embedding_model": embedding_model, "source_file": filename}),
        ))
    db.commit()
    db.refresh(document)
    return document, len(chunks)


def list_policies(db: Session) -> list[AIKnowledgeDocument]:
    return list(db.scalars(select(AIKnowledgeDocument).where(AIKnowledgeDocument.category == "policy").order_by(AIKnowledgeDocument.created_at.desc())).all())
