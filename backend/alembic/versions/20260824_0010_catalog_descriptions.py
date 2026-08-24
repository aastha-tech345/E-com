"""add category and brand descriptions

Revision ID: 20260824_0010
Revises: 20260824_0009
"""

from alembic import op
import sqlalchemy as sa

revision = "20260824_0010"
down_revision = "20260824_0009"
branch_labels = None
depends_on = None


def upgrade() -> None:
    inspector = sa.inspect(op.get_bind())
    category_columns = {column["name"] for column in inspector.get_columns("categories")}
    brand_columns = {column["name"] for column in inspector.get_columns("brands")}
    if "description" not in category_columns:
        op.add_column("categories", sa.Column("description", sa.Text(), nullable=False, server_default=""))
    if "description" not in brand_columns:
        op.add_column("brands", sa.Column("description", sa.Text(), nullable=False, server_default=""))


def downgrade() -> None:
    op.drop_column("brands", "description")
    op.drop_column("categories", "description")
