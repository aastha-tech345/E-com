"""store knowledge vectors in a dedicated table

Revision ID: 20260824_0008
Revises: 20260820_0007
"""

from alembic import op
import sqlalchemy as sa

revision = "20260824_0008"
down_revision = "20260820_0007"
branch_labels = None
depends_on = None


def upgrade() -> None:
    if "ai_knowledge_embeddings" in sa.inspect(op.get_bind()).get_table_names():
        return
    op.create_table(
        "ai_knowledge_embeddings",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("chunk_id", sa.String(length=36), sa.ForeignKey("ai_knowledge_chunks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("provider", sa.String(length=80), nullable=False, server_default="huggingface"),
        sa.Column("model", sa.String(length=200), nullable=False),
        sa.Column("dimensions", sa.Integer(), nullable=False),
        sa.Column("vector_json", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("chunk_id", name="uq_ai_knowledge_embeddings_chunk"),
    )
    op.create_index("ix_ai_knowledge_embeddings_chunk_id", "ai_knowledge_embeddings", ["chunk_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_ai_knowledge_embeddings_chunk_id", table_name="ai_knowledge_embeddings")
    op.drop_table("ai_knowledge_embeddings")
