"""add product_image to order_items

Revision ID: 20260825_0001
Revises: 20260824_0014
"""

from alembic import op
import sqlalchemy as sa


revision = "20260825_0001"
down_revision = "20260824_0014"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('order_items', sa.Column('product_image', sa.String(length=500), server_default='', nullable=False))


def downgrade() -> None:
    op.drop_column('order_items', 'product_image')
