"""add return proof fields

Revision ID: 20260825_0017
Revises: 20260825_0016
"""

from alembic import op
import sqlalchemy as sa


revision = "20260825_0017"
down_revision = "20260825_0016"
branch_labels = None
depends_on = None


def _column_names(table_name: str) -> set[str]:
    return {column["name"] for column in sa.inspect(op.get_bind()).get_columns(table_name)}


def upgrade() -> None:
    columns = _column_names("return_requests")
    if "issue_reason" not in columns:
        op.add_column("return_requests", sa.Column("issue_reason", sa.String(length=160), nullable=False, server_default=""))
    if "proof_url" not in columns:
        op.add_column("return_requests", sa.Column("proof_url", sa.String(length=500), nullable=False, server_default=""))
    if "proof_type" not in columns:
        op.add_column("return_requests", sa.Column("proof_type", sa.String(length=40), nullable=False, server_default=""))


def downgrade() -> None:
    columns = _column_names("return_requests")
    if "proof_type" in columns:
        op.drop_column("return_requests", "proof_type")
    if "proof_url" in columns:
        op.drop_column("return_requests", "proof_url")
    if "issue_reason" in columns:
        op.drop_column("return_requests", "issue_reason")
