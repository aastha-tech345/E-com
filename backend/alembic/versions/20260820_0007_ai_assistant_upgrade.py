"""ai assistant upgrade

Revision ID: 20260820_0007
Revises: 20260820_0006
Create Date: 2026-08-20
"""

from alembic import op
import sqlalchemy as sa


revision = "20260820_0007"
down_revision = "20260820_0006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Some development databases were initialized with Base.metadata.create_all()
    # before this revision was recorded. In that case the complete AI assistant
    # schema already exists and Alembic must only advance its version marker.
    existing_tables = set(sa.inspect(op.get_bind()).get_table_names())
    assistant_tables = {
        "ai_conversation_contexts",
        "ai_tool_invocations",
        "ai_knowledge_documents",
        "ai_knowledge_chunks",
        "ai_assistant_feedback",
    }
    if assistant_tables.issubset(existing_tables):
        return

    op.add_column("ai_conversations", sa.Column("title", sa.String(length=160), nullable=False, server_default="New conversation"))
    op.add_column("ai_conversations", sa.Column("last_intent", sa.String(length=40), nullable=False, server_default="product_search"))
    op.add_column("ai_conversations", sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))

    op.create_table(
        "ai_conversation_contexts",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("conversation_id", sa.String(length=36), sa.ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False, server_default=""),
        sa.Column("preference_profile", sa.Text(), nullable=False, server_default="{}"),
        sa.Column("last_tool_names", sa.Text(), nullable=False, server_default="[]"),
        sa.Column("message_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("conversation_id", name="uq_ai_conversation_contexts_conversation"),
    )
    op.create_index("ix_ai_conversation_contexts_conversation_id", "ai_conversation_contexts", ["conversation_id"], unique=False)

    op.create_table(
        "ai_tool_invocations",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("conversation_id", sa.String(length=36), sa.ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("tool_name", sa.String(length=120), nullable=False),
        sa.Column("status", sa.String(length=24), nullable=False, server_default="completed"),
        sa.Column("detail", sa.Text(), nullable=False, server_default=""),
        sa.Column("payload_json", sa.Text(), nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_ai_tool_invocations_conversation_id", "ai_tool_invocations", ["conversation_id"], unique=False)
    op.create_index("ix_ai_tool_invocations_user_id", "ai_tool_invocations", ["user_id"], unique=False)
    op.create_index("ix_ai_tool_invocations_tool_name", "ai_tool_invocations", ["tool_name"], unique=False)

    op.create_table(
        "ai_knowledge_documents",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("category", sa.String(length=60), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("source", sa.String(length=120), nullable=False, server_default="seeded"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_ai_knowledge_documents_slug", "ai_knowledge_documents", ["slug"], unique=False)
    op.create_index("ix_ai_knowledge_documents_category", "ai_knowledge_documents", ["category"], unique=False)
    op.create_index("ix_ai_knowledge_documents_is_active", "ai_knowledge_documents", ["is_active"], unique=False)

    op.create_table(
        "ai_knowledge_chunks",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("document_id", sa.String(length=36), sa.ForeignKey("ai_knowledge_documents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("heading", sa.String(length=160), nullable=False, server_default=""),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("metadata_json", sa.Text(), nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_ai_knowledge_chunks_document_id", "ai_knowledge_chunks", ["document_id"], unique=False)

    op.create_table(
        "ai_assistant_feedback",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("conversation_id", sa.String(length=36), sa.ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("message_id", sa.String(length=36), sa.ForeignKey("ai_messages.id", ondelete="SET NULL"), nullable=True),
        sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("rating", sa.String(length=16), nullable=False),
        sa.Column("feedback_text", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_ai_assistant_feedback_conversation_id", "ai_assistant_feedback", ["conversation_id"], unique=False)
    op.create_index("ix_ai_assistant_feedback_message_id", "ai_assistant_feedback", ["message_id"], unique=False)
    op.create_index("ix_ai_assistant_feedback_user_id", "ai_assistant_feedback", ["user_id"], unique=False)
    op.create_index("ix_ai_assistant_feedback_rating", "ai_assistant_feedback", ["rating"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_ai_assistant_feedback_rating", table_name="ai_assistant_feedback")
    op.drop_index("ix_ai_assistant_feedback_user_id", table_name="ai_assistant_feedback")
    op.drop_index("ix_ai_assistant_feedback_message_id", table_name="ai_assistant_feedback")
    op.drop_index("ix_ai_assistant_feedback_conversation_id", table_name="ai_assistant_feedback")
    op.drop_table("ai_assistant_feedback")

    op.drop_index("ix_ai_knowledge_chunks_document_id", table_name="ai_knowledge_chunks")
    op.drop_table("ai_knowledge_chunks")

    op.drop_index("ix_ai_knowledge_documents_is_active", table_name="ai_knowledge_documents")
    op.drop_index("ix_ai_knowledge_documents_category", table_name="ai_knowledge_documents")
    op.drop_index("ix_ai_knowledge_documents_slug", table_name="ai_knowledge_documents")
    op.drop_table("ai_knowledge_documents")

    op.drop_index("ix_ai_tool_invocations_tool_name", table_name="ai_tool_invocations")
    op.drop_index("ix_ai_tool_invocations_user_id", table_name="ai_tool_invocations")
    op.drop_index("ix_ai_tool_invocations_conversation_id", table_name="ai_tool_invocations")
    op.drop_table("ai_tool_invocations")

    op.drop_index("ix_ai_conversation_contexts_conversation_id", table_name="ai_conversation_contexts")
    op.drop_table("ai_conversation_contexts")

    op.drop_column("ai_conversations", "updated_at")
    op.drop_column("ai_conversations", "last_intent")
    op.drop_column("ai_conversations", "title")
