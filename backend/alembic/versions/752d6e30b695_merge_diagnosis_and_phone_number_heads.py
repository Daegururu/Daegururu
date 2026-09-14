"""merge diagnosis and phone_number heads

Revision ID: 752d6e30b695
Revises: 03d4f664e2ea, b273c59d976f
Create Date: 2026-09-14 21:03:23.735980

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '752d6e30b695'
down_revision: Union[str, Sequence[str], None] = ('03d4f664e2ea', 'b273c59d976f')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
