"""stripe checkout sessions

Revision ID: 20260820_0009
Revises: 20260820_0008
Create Date: 2026-08-20
"""

from alembic import op
import sqlalchemy as sa


revision = "20260820_0009"
down_revision = "20260820_0008"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    table_exists = inspector.has_table("stripe_checkout_sessions")

    if not table_exists:
        op.create_table(
            "stripe_checkout_sessions",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("session_id", sa.String(length=255), nullable=False),
            sa.Column("payment_intent_id", sa.String(length=255), nullable=True),
            sa.Column("user_id", sa.String(length=36), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
            sa.Column("order_id", sa.String(length=36), sa.ForeignKey("orders.id", ondelete="SET NULL"), nullable=True),
            sa.Column("status", sa.String(length=40), nullable=False, server_default="open"),
            sa.Column("payment_status", sa.String(length=40), nullable=False, server_default="unpaid"),
            sa.Column("amount_total", sa.Numeric(12, 2), nullable=False, server_default="0.00"),
            sa.Column("currency", sa.String(length=3), nullable=False, server_default="INR"),
            sa.Column("customer_email", sa.String(length=255), nullable=True),
            sa.Column("checkout_url", sa.Text(), nullable=False, server_default=""),
            sa.Column("metadata_json", sa.Text(), nullable=False, server_default="{}"),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
            sa.UniqueConstraint("session_id", name="uq_stripe_checkout_sessions_session_id"),
        )

    existing_indexes = {
        index["name"] for index in inspector.get_indexes("stripe_checkout_sessions")
    } if table_exists else set()
    indexes = (
        ("ix_stripe_checkout_sessions_session_id", ["session_id"]),
        ("ix_stripe_checkout_sessions_payment_intent_id", ["payment_intent_id"]),
        ("ix_stripe_checkout_sessions_user_id", ["user_id"]),
        ("ix_stripe_checkout_sessions_order_id", ["order_id"]),
        ("ix_stripe_checkout_sessions_status", ["status"]),
        ("ix_stripe_checkout_sessions_payment_status", ["payment_status"]),
    )
    for name, columns in indexes:
        if name not in existing_indexes:
            op.create_index(name, "stripe_checkout_sessions", columns, unique=False)


def downgrade() -> None:
    op.drop_index("ix_stripe_checkout_sessions_payment_status", table_name="stripe_checkout_sessions")
    op.drop_index("ix_stripe_checkout_sessions_status", table_name="stripe_checkout_sessions")
    op.drop_index("ix_stripe_checkout_sessions_order_id", table_name="stripe_checkout_sessions")
    op.drop_index("ix_stripe_checkout_sessions_user_id", table_name="stripe_checkout_sessions")
    op.drop_index("ix_stripe_checkout_sessions_payment_intent_id", table_name="stripe_checkout_sessions")
    op.drop_index("ix_stripe_checkout_sessions_session_id", table_name="stripe_checkout_sessions")
    op.drop_table("stripe_checkout_sessions")
