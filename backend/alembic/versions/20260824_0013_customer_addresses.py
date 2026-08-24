"""add saved customer addresses

Revision ID: 20260824_0013
Revises: 20260824_0012
"""

from alembic import op
import sqlalchemy as sa

revision = "20260824_0013"
down_revision = "20260824_0012"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    if "customer_addresses" in inspector.get_table_names():
        return
    op.create_table(
        "customer_addresses",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("recipient_name", sa.String(length=120), nullable=False),
        sa.Column("line1", sa.String(length=255), nullable=False),
        sa.Column("city", sa.String(length=120), nullable=False),
        sa.Column("state", sa.String(length=120), nullable=False),
        sa.Column("postal_code", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_customer_addresses_user_id", "customer_addresses", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_customer_addresses_user_id", table_name="customer_addresses")
    op.drop_table("customer_addresses")
