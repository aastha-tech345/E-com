"""add catalog soft delete fields

Revision ID: 20260824_0011
Revises: 20260824_0010
"""

from alembic import op
import sqlalchemy as sa

revision = "20260824_0011"
down_revision = "20260824_0010"
branch_labels = None
depends_on = None


def upgrade() -> None:
    for table in ("categories", "brands", "products"):
        columns = {column["name"] for column in sa.inspect(op.get_bind()).get_columns(table)}
        if "is_deleted" not in columns:
            op.add_column(table, sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()))
            op.create_index(f"ix_{table}_is_deleted", table, ["is_deleted"], unique=False)
        if "deleted_at" not in columns:
            op.add_column(table, sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    for table in ("products", "brands", "categories"):
        op.drop_column(table, "deleted_at")
        op.drop_index(f"ix_{table}_is_deleted", table_name=table)
        op.drop_column(table, "is_deleted")
