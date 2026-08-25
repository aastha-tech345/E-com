"""repair catalog schema columns

Revision ID: 20260824_0014
Revises: 20260820_0009
"""

from alembic import op
import sqlalchemy as sa


revision = "20260824_0014"
down_revision = "20260820_0009"
branch_labels = None
depends_on = None


def _columns(table_name: str) -> set[str]:
    return {column["name"] for column in sa.inspect(op.get_bind()).get_columns(table_name)}


def _indexes(table_name: str) -> set[str]:
    return {index["name"] for index in sa.inspect(op.get_bind()).get_indexes(table_name)}


def _add_column_if_missing(table_name: str, column_name: str, column: sa.Column) -> None:
    if column_name not in _columns(table_name):
        op.add_column(table_name, column)


def _add_index_if_missing(table_name: str, index_name: str, columns: list[str]) -> None:
    if index_name not in _indexes(table_name):
        op.create_index(index_name, table_name, columns, unique=False)


def upgrade() -> None:
    _add_column_if_missing("categories", "description", sa.Column("description", sa.Text(), nullable=False, server_default=""))
    _add_column_if_missing("categories", "is_deleted", sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()))
    _add_column_if_missing("categories", "deleted_at", sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True))
    _add_column_if_missing("categories", "parent_id", sa.Column("parent_id", sa.String(length=36), nullable=True))
    _add_index_if_missing("categories", "ix_categories_is_deleted", ["is_deleted"])

    _add_column_if_missing("brands", "description", sa.Column("description", sa.Text(), nullable=False, server_default=""))
    _add_column_if_missing("brands", "is_deleted", sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()))
    _add_column_if_missing("brands", "deleted_at", sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True))
    _add_index_if_missing("brands", "ix_brands_is_deleted", ["is_deleted"])

    _add_column_if_missing("products", "is_deleted", sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()))
    _add_column_if_missing("products", "deleted_at", sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True))
    _add_index_if_missing("products", "ix_products_is_deleted", ["is_deleted"])


def downgrade() -> None:
    # Repair migration is intentionally conservative. Downgrade is a no-op so
    # it does not remove columns that may have been created by earlier migrations.
    pass
