"""add product attributes

Revision ID: 20260824_0009
Revises: 20260824_0008
"""

from alembic import op
import sqlalchemy as sa

revision = "20260824_0009"
down_revision = "20260824_0008"
branch_labels = None
depends_on = None


def upgrade() -> None:
    if "product_attributes" in sa.inspect(op.get_bind()).get_table_names():
        return
    op.create_table(
        "product_attributes",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=140), nullable=False),
        sa.Column("attribute_type", sa.String(length=40), nullable=False, server_default="select"),
        sa.Column("values", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("slug", name="uq_product_attributes_slug"),
    )
    op.create_index("ix_product_attributes_name", "product_attributes", ["name"], unique=False)
    op.create_index("ix_product_attributes_slug", "product_attributes", ["slug"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_product_attributes_slug", table_name="product_attributes")
    op.drop_index("ix_product_attributes_name", table_name="product_attributes")
    op.drop_table("product_attributes")
