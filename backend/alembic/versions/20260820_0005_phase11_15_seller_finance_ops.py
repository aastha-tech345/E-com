"""phase 11 15 seller finance ops

Revision ID: 20260820_0005
Revises: 20260820_0004
Create Date: 2026-08-20
"""

from alembic import op
import sqlalchemy as sa


revision = "20260820_0005"
down_revision = "20260820_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("order_items") as batch_op:
        batch_op.add_column(sa.Column("seller_id", sa.String(length=36), nullable=True))
        batch_op.add_column(sa.Column("commission_rate", sa.Numeric(5, 4), nullable=False, server_default="0.1000"))
        batch_op.add_column(sa.Column("commission_amount", sa.Numeric(12, 2), nullable=False, server_default="0.00"))
        batch_op.add_column(sa.Column("seller_payout_amount", sa.Numeric(12, 2), nullable=False, server_default="0.00"))
        batch_op.create_index("ix_order_items_seller_id", ["seller_id"], unique=False)
        batch_op.create_foreign_key("fk_order_items_seller_id_users", "users", ["seller_id"], ["id"], ondelete="SET NULL")

    with op.batch_alter_table("notifications") as batch_op:
        batch_op.add_column(sa.Column("read_at", sa.DateTime(timezone=True), nullable=True))

    with op.batch_alter_table("seller_settlements") as batch_op:
        batch_op.add_column(sa.Column("seller_user_id", sa.String(length=36), nullable=True))
        batch_op.add_column(sa.Column("payout_reference", sa.String(length=80), nullable=False, server_default=""))
        batch_op.add_column(sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True))
        batch_op.create_index("ix_seller_settlements_seller_user_id", ["seller_user_id"], unique=False)
        batch_op.create_foreign_key(
            "fk_seller_settlements_seller_user_id_users",
            "users",
            ["seller_user_id"],
            ["id"],
            ondelete="SET NULL",
        )


def downgrade() -> None:
    with op.batch_alter_table("seller_settlements") as batch_op:
        batch_op.drop_constraint("fk_seller_settlements_seller_user_id_users", type_="foreignkey")
        batch_op.drop_index("ix_seller_settlements_seller_user_id")
        batch_op.drop_column("paid_at")
        batch_op.drop_column("payout_reference")
        batch_op.drop_column("seller_user_id")

    with op.batch_alter_table("notifications") as batch_op:
        batch_op.drop_column("read_at")

    with op.batch_alter_table("order_items") as batch_op:
        batch_op.drop_constraint("fk_order_items_seller_id_users", type_="foreignkey")
        batch_op.drop_index("ix_order_items_seller_id")
        batch_op.drop_column("seller_payout_amount")
        batch_op.drop_column("commission_amount")
        batch_op.drop_column("commission_rate")
        batch_op.drop_column("seller_id")
