"""phase 2 inventory pricing cart

Revision ID: 20260820_0002
Revises: 20260820_0001
Create Date: 2026-08-20
"""

from alembic import op
import sqlalchemy as sa


revision = "20260820_0002"
down_revision = "20260820_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "variant_prices",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("variant_id", sa.String(length=36), sa.ForeignKey("product_variants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("price_list_name", sa.String(length=80), nullable=False, server_default="default"),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="INR"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("variant_id", "price_list_name", name="uq_variant_prices_variant_price_list"),
    )
    op.create_index("ix_variant_prices_variant_id", "variant_prices", ["variant_id"], unique=False)

    op.create_table(
        "inventory_items",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("variant_id", sa.String(length=36), sa.ForeignKey("product_variants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("warehouse_code", sa.String(length=40), nullable=False, server_default="primary"),
        sa.Column("on_hand", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("reserved", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("variant_id", "warehouse_code", name="uq_inventory_variant_warehouse"),
    )
    op.create_index("ix_inventory_items_variant_id", "inventory_items", ["variant_id"], unique=False)

    op.create_table(
        "inventory_movements",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("inventory_item_id", sa.String(length=36), sa.ForeignKey("inventory_items.id", ondelete="CASCADE"), nullable=False),
        sa.Column("delta", sa.Integer(), nullable=False),
        sa.Column("reason", sa.String(length=80), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_inventory_movements_inventory_item_id", "inventory_movements", ["inventory_item_id"], unique=False)

    op.create_table(
        "carts",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="INR"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", name="uq_carts_user_id"),
    )
    op.create_index("ix_carts_user_id", "carts", ["user_id"], unique=False)

    op.create_table(
        "cart_items",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("cart_id", sa.String(length=36), sa.ForeignKey("carts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("variant_id", sa.String(length=36), sa.ForeignKey("product_variants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("cart_id", "variant_id", name="uq_cart_items_cart_variant"),
    )
    op.create_index("ix_cart_items_cart_id", "cart_items", ["cart_id"], unique=False)
    op.create_index("ix_cart_items_variant_id", "cart_items", ["variant_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_cart_items_variant_id", table_name="cart_items")
    op.drop_index("ix_cart_items_cart_id", table_name="cart_items")
    op.drop_table("cart_items")
    op.drop_index("ix_carts_user_id", table_name="carts")
    op.drop_table("carts")
    op.drop_index("ix_inventory_movements_inventory_item_id", table_name="inventory_movements")
    op.drop_table("inventory_movements")
    op.drop_index("ix_inventory_items_variant_id", table_name="inventory_items")
    op.drop_table("inventory_items")
    op.drop_index("ix_variant_prices_variant_id", table_name="variant_prices")
    op.drop_table("variant_prices")
