"""add delivered timestamp to order items

Revision ID: 20260825_0003
Revises: 20260825_0002
"""

from alembic import op
import sqlalchemy as sa


revision = "20260825_0003"
down_revision = "20260825_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    columns = {column["name"] for column in sa.inspect(op.get_bind()).get_columns("order_items")}
    if "delivered_at" not in columns:
        op.add_column("order_items", sa.Column("delivered_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    columns = {column["name"] for column in sa.inspect(op.get_bind()).get_columns("order_items")}
    if "delivered_at" in columns:
        op.drop_column("order_items", "delivered_at")
