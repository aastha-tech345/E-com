"""add policy document descriptions

Revision ID: 20260824_0012
Revises: 20260824_0011
"""

from alembic import op
import sqlalchemy as sa

revision = "20260824_0012"
down_revision = "20260824_0011"
branch_labels = None
depends_on = None


def upgrade() -> None:
    columns = {column["name"] for column in sa.inspect(op.get_bind()).get_columns("ai_knowledge_documents")}
    if "description" not in columns:
        op.add_column("ai_knowledge_documents", sa.Column("description", sa.Text(), nullable=False, server_default=""))


def downgrade() -> None:
    op.drop_column("ai_knowledge_documents", "description")
