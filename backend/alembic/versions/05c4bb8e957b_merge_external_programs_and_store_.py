"""merge external programs and store category heads

Revision ID: 05c4bb8e957b
Revises: 7014d2ace8a2, 75c26922fbe1
Create Date: 2026-09-18 13:12:13.045757

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '05c4bb8e957b'
down_revision: Union[str, Sequence[str], None] = ('7014d2ace8a2', '75c26922fbe1')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
