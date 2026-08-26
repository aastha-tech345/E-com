"""add replacement product to return requests

Revision ID: 20260826_0001
Revises: 20260825_0018
"""

from alembic import op
import sqlalchemy as sa


revision = "20260826_0001"
down_revision = "20260825_0018"
branch_labels = None
depends_on = None


def _column_names(table_name: str) -> set[str]:
    return {column["name"] for column in sa.inspect(op.get_bind()).get_columns(table_name)}


def upgrade() -> None:
    if "replacement_product_id" not in _column_names("return_requests"):
        op.add_column(
            "return_requests",
            sa.Column("replacement_product_id", sa.String(length=36), nullable=True),
        )
        op.create_foreign_key(
            "fk_return_requests_replacement_product_id_products",
            "return_requests",
            "products",
            ["replacement_product_id"],
            ["id"],
            ondelete="SET NULL",
        )


def downgrade() -> None:
    if "replacement_product_id" in _column_names("return_requests"):
        op.drop_constraint(
            "fk_return_requests_replacement_product_id_products",
            "return_requests",
            type_="foreignkey",
        )
        op.drop_column("return_requests", "replacement_product_id")
