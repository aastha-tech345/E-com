"""add per-item order tracking

Revision ID: 20260825_0002
Revises: 20260825_0001
"""

from alembic import op
import sqlalchemy as sa
from uuid import uuid4


revision = "20260825_0002"
down_revision = "20260825_0001"
branch_labels = None
depends_on = None


def _table_names() -> set[str]:
    return set(sa.inspect(op.get_bind()).get_table_names())


def _column_names(table_name: str) -> set[str]:
    return {column["name"] for column in sa.inspect(op.get_bind()).get_columns(table_name)}


def _index_names(table_name: str) -> set[str]:
    return {index["name"] for index in sa.inspect(op.get_bind()).get_indexes(table_name)}


def _add_column_if_missing(column_name: str, column: sa.Column) -> None:
    if column_name not in _column_names("order_items"):
        op.add_column("order_items", column)


def _create_index_if_missing(index_name: str, table_name: str, columns: list[str], *, unique: bool = False) -> None:
    if index_name not in _index_names(table_name):
        op.create_index(index_name, table_name, columns, unique=unique)


def upgrade() -> None:
    _add_column_if_missing("item_number", sa.Column("item_number", sa.String(length=48), nullable=True))
    _add_column_if_missing("status", sa.Column("status", sa.String(length=40), nullable=True))
    _add_column_if_missing("tracking_number", sa.Column("tracking_number", sa.String(length=80), nullable=True))
    _add_column_if_missing("shipping_partner", sa.Column("shipping_partner", sa.String(length=80), nullable=True))
    _add_column_if_missing("estimated_delivery", sa.Column("estimated_delivery", sa.DateTime(timezone=True), nullable=True))
    _add_column_if_missing("delivered_at", sa.Column("delivered_at", sa.DateTime(timezone=True), nullable=True))

    bind = op.get_bind()
    rows = bind.execute(sa.text("SELECT id, order_id FROM order_items ORDER BY order_id, id")).mappings().all()
    positions: dict[str, int] = {}
    for row in rows:
        order_id = row["order_id"]
        positions[order_id] = positions.get(order_id, 0) + 1
        order_number = bind.execute(
            sa.text("SELECT order_number FROM orders WHERE id = :order_id"), {"order_id": order_id}
        ).scalar_one()
        item_number = f"ITM-{order_number.removeprefix('ORD-')}-{positions[order_id]:02d}"
        bind.execute(
            sa.text(
                "UPDATE order_items SET item_number = :item_number, status = 'pending', "
                "tracking_number = '', shipping_partner = '' WHERE id = :item_id"
            ),
            {"item_number": item_number, "item_id": row["id"]},
        )

    _create_index_if_missing("ix_order_items_item_number", "order_items", ["item_number"], unique=True)
    _create_index_if_missing("ix_order_items_status", "order_items", ["status"])
    if "order_item_status_history" not in _table_names():
        op.create_table(
            "order_item_status_history",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("order_item_id", sa.String(length=36), sa.ForeignKey("order_items.id", ondelete="CASCADE"), nullable=False),
            sa.Column("status", sa.String(length=40), nullable=False),
            sa.Column("note", sa.Text(), nullable=False, server_default=""),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        )
    _create_index_if_missing(
        "ix_order_item_status_history_order_item_id",
        "order_item_status_history",
        ["order_item_id"],
    )

    for row in rows:
        has_history = bind.execute(
            sa.text("SELECT 1 FROM order_item_status_history WHERE order_item_id = :item_id LIMIT 1"),
            {"item_id": row["id"]},
        ).scalar()
        if has_history is None:
            bind.execute(
                sa.text(
                    "INSERT INTO order_item_status_history (id, order_item_id, status, note) "
                    "VALUES (:id, :item_id, 'pending', 'Migration backfill')"
                ),
                {"id": str(uuid4()), "item_id": row["id"]},
            )


def downgrade() -> None:
    op.drop_index("ix_order_item_status_history_order_item_id", table_name="order_item_status_history")
    op.drop_table("order_item_status_history")
    op.drop_index("ix_order_items_status", table_name="order_items")
    op.drop_index("ix_order_items_item_number", table_name="order_items")
    op.drop_column("order_items", "estimated_delivery")
    op.drop_column("order_items", "delivered_at")
    op.drop_column("order_items", "shipping_partner")
    op.drop_column("order_items", "tracking_number")
    op.drop_column("order_items", "status")
    op.drop_column("order_items", "item_number")
