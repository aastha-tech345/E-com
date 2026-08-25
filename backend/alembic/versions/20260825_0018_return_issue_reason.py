"""add return issue reason

Revision ID: 20260825_0018
Revises: 20260825_0017
"""

from alembic import op
import sqlalchemy as sa


revision = "20260825_0018"
down_revision = "20260825_0017"
branch_labels = None
depends_on = None


def _column_names(table_name: str) -> set[str]:
    return {column["name"] for column in sa.inspect(op.get_bind()).get_columns(table_name)}


def upgrade() -> None:
    if "issue_reason" not in _column_names("return_requests"):
        op.add_column("return_requests", sa.Column("issue_reason", sa.String(length=160), nullable=False, server_default=""))


def downgrade() -> None:
    if "issue_reason" in _column_names("return_requests"):
        op.drop_column("return_requests", "issue_reason")
