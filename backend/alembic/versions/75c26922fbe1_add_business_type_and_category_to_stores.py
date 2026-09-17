"""add business type and category to stores

Revision ID: 75c26922fbe1
Revises: 2e51546c423a
Create Date: 2026-09-17 11:04:24.397820

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '75c26922fbe1'
down_revision: Union[str, Sequence[str], None] = '2e51546c423a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 기존 행이 있을 수 있어 server_default로 채운 뒤 NOT NULL로 둔다.
    op.add_column('stores', sa.Column('business_type', sa.String(length=100), nullable=False, server_default=''))
    op.add_column('stores', sa.Column('business_category', sa.String(length=100), nullable=False, server_default=''))
    op.alter_column('stores', 'business_type', server_default=None)
    op.alter_column('stores', 'business_category', server_default=None)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('stores', 'business_category')
    op.drop_column('stores', 'business_type')
