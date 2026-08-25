"""repair policy document description column

Revision ID: 20260825_0015
Revises: 20260824_0014
"""

from alembic import op
import sqlalchemy as sa


revision = "20260825_0015"
down_revision = "20260824_0014"
branch_labels = None
depends_on = None


def upgrade() -> None:
    columns = {column["name"] for column in sa.inspect(op.get_bind()).get_columns("ai_knowledge_documents")}
    if "description" not in columns:
        op.add_column("ai_knowledge_documents", sa.Column("description", sa.Text(), nullable=False, server_default=""))


def downgrade() -> None:
    # Repair migration is intentionally conservative. Downgrade is a no-op so
    # it does not remove a column that older migrations may already own.
    pass
