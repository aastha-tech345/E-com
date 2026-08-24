"""cart item status

Revision ID: 20260820_0008
Revises: 20260824_0013
Create Date: 2026-08-20
"""

from alembic import op
import sqlalchemy as sa


revision = "20260820_0008"
down_revision = "20260824_0013"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("cart_items") as batch_op:
        batch_op.add_column(sa.Column("status", sa.String(length=24), nullable=False, server_default="active"))
        batch_op.add_column(sa.Column("checkout_session_id", sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column("order_id", sa.String(length=36), nullable=True))
        batch_op.add_column(sa.Column("purchased_at", sa.DateTime(timezone=True), nullable=True))
        batch_op.drop_constraint("uq_cart_items_cart_variant", type_="unique")
        batch_op.create_foreign_key(
            "fk_cart_items_order_id_orders",
            "orders",
            ["order_id"],
            ["id"],
            ondelete="SET NULL",
        )

    op.create_index("ix_cart_items_status", "cart_items", ["status"], unique=False)
    op.create_index("ix_cart_items_checkout_session_id", "cart_items", ["checkout_session_id"], unique=False)
    op.create_index("ix_cart_items_order_id", "cart_items", ["order_id"], unique=False)
    op.create_index(
        "uq_cart_items_active_cart_variant",
        "cart_items",
        ["cart_id", "variant_id"],
        unique=True,
        postgresql_where=sa.text("status = 'active'"),
        sqlite_where=sa.text("status = 'active'"),
    )


def downgrade() -> None:
    op.drop_index("uq_cart_items_active_cart_variant", table_name="cart_items")
    op.create_unique_constraint("uq_cart_items_cart_variant", "cart_items", ["cart_id", "variant_id"])

    op.drop_index("ix_cart_items_order_id", table_name="cart_items")
    op.drop_index("ix_cart_items_checkout_session_id", table_name="cart_items")
    op.drop_index("ix_cart_items_status", table_name="cart_items")
    with op.batch_alter_table("cart_items") as batch_op:
        batch_op.drop_constraint("fk_cart_items_order_id_orders", type_="foreignkey")
        batch_op.drop_column("purchased_at")
        batch_op.drop_column("order_id")
        batch_op.drop_column("checkout_session_id")
        batch_op.drop_column("status")
