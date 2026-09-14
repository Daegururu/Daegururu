"""merge sales and diagnosis heads

Revision ID: d79c40fc1dcf
Revises: 752d6e30b695, cb2c144f440f
Create Date: 2026-09-14 23:58:02.290063

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd79c40fc1dcf'
down_revision: Union[str, Sequence[str], None] = ('752d6e30b695', 'cb2c144f440f')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
