from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.knowledge_base import SEED_KNOWLEDGE_DOCUMENTS
from app.modules.ai_assistant.domain.models import AIKnowledgeChunk, AIKnowledgeDocument


@dataclass(slots=True)
class RetrievedKnowledge:
    title: str
    category: str
    content: str


def ensure_seed_knowledge(db: Session) -> None:
    existing = {
        slug
        for slug in db.scalars(select(AIKnowledgeDocument.slug).where(AIKnowledgeDocument.source == "seeded")).all()
    }
    for document in SEED_KNOWLEDGE_DOCUMENTS:
        if document.slug in existing:
            continue
        row = AIKnowledgeDocument(
            slug=document.slug,
            title=document.title,
            category=document.category,
            content=document.content,
            source="seeded",
            is_active=True,
        )
        db.add(row)
        db.flush()
        db.add(
            AIKnowledgeChunk(
                document_id=row.id,
                chunk_index=0,
                heading=document.title,
                content=document.content,
                metadata_json='{"seeded": true}',
            )
        )


def retrieve_knowledge(db: Session, *, query: str, limit: int = 3) -> list[RetrievedKnowledge]:
    ensure_seed_knowledge(db)
    tokens = [token.strip().lower() for token in query.split() if len(token.strip()) >= 3]
    statement = select(AIKnowledgeChunk, AIKnowledgeDocument).join(
        AIKnowledgeDocument, AIKnowledgeDocument.id == AIKnowledgeChunk.document_id
    )
    if tokens:
        filters = [
            or_(
                AIKnowledgeDocument.category.ilike(f"%{token}%"),
                AIKnowledgeDocument.title.ilike(f"%{token}%"),
                AIKnowledgeChunk.content.ilike(f"%{token}%"),
            )
            for token in tokens[:5]
        ]
        statement = statement.where(or_(*filters))
    rows = db.execute(statement.limit(limit)).all()
    return [
        RetrievedKnowledge(
            title=document.title,
            category=document.category,
            content=chunk.content,
        )
        for chunk, document in rows
    ]
