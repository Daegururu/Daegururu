"""add finance product detail fields

Revision ID: 2e51546c423a
Revises: d79c40fc1dcf
Create Date: 2026-09-15 14:05:46.210915

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '2e51546c423a'
down_revision: Union[str, Sequence[str], None] = 'd79c40fc1dcf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


SEED_BACKFILL = {
    "대구시 골목상권 활력자금": dict(
        provider="대구광역시", category="policy", logo_text="대구", target="골목상권 점포 대상",
        term_years=3, grace_period_months=12, review_days=5,
        overview="대구광역시가 골목상권 점포의 운영 안정을 위해 지원하는 정책자금입니다. 시 이차보전으로 금리가 가장 낮고, 거치기간 1년 후 2년 원리금 균등분할 상환 조건입니다.",
        documents=["사업자등록증 사본", "부가세 과세표준증명원 (최근 1년)", "지방세 완납증명서", "통장 사본"],
        diagnosis_note="금리가 가장 낮아 현금흐름이 마이너스인 달의 부담을 메우는 데 유리합니다.",
    ),
    "iM뱅크 소상공인 특별운영자금": dict(
        provider="iM뱅크", category="operating", logo_text="iM", target="대구 소재 소상공인 우대",
        term_years=5, grace_period_months=12, review_days=3,
        overview="대구 소재 소상공인의 운영자금을 지원하는 iM뱅크 특별 상품입니다. 골목상권 점포에는 우대금리 0.4%p가 추가 적용되며, 거치기간 1년 후 4년 원리금 균등분할 상환 조건입니다.",
        documents=["사업자등록증 사본", "부가세 과세표준증명원 (최근 1년)", "국세·지방세 완납증명서", "통장 사본 (iM뱅크 계좌)"],
        diagnosis_note="거치기간 1년 조건이라 고정비 비중이 높은 상황에서 상환 부담을 늦추는 데 유리합니다.",
    ),
    "소상공인시장진흥공단 정책자금": dict(
        provider="소진공", category="policy", logo_text="소진", target="업력 1년 이상",
        term_years=5, grace_period_months=24, review_days=10,
        overview="소상공인시장진흥공단이 직접 대출하는 일반경영안정자금입니다. 한도가 가장 크고 거치기간 2년 후 3년 원리금 균등분할 상환 조건이라 당장의 상환 부담이 적습니다.",
        documents=["사업자등록증 사본", "부가세 과세표준증명원 (최근 1년)", "국세·지방세 완납증명서", "소상공인 확인서"],
        diagnosis_note="거치기간이 2년으로 가장 길어 당장의 현금흐름 부담 없이 자금을 확보할 수 있습니다.",
    ),
}


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('financial_products', sa.Column('provider', sa.String(length=100), nullable=True))
    op.add_column('financial_products', sa.Column('category', sa.String(length=20), nullable=True))
    op.add_column('financial_products', sa.Column('logo_text', sa.String(length=10), nullable=True))
    op.add_column('financial_products', sa.Column('target', sa.String(length=100), nullable=True))
    op.add_column('financial_products', sa.Column('term_years', sa.Integer(), nullable=True))
    op.add_column('financial_products', sa.Column('grace_period_months', sa.Integer(), server_default='0', nullable=False))
    op.add_column('financial_products', sa.Column('overview', sa.Text(), nullable=True))
    op.add_column('financial_products', sa.Column('documents', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column('financial_products', sa.Column('review_days', sa.Integer(), nullable=True))
    op.add_column('financial_products', sa.Column('diagnosis_note', sa.Text(), nullable=True))

    connection = op.get_bind()
    products_table = sa.table(
        'financial_products',
        sa.column('name', sa.String),
        sa.column('provider', sa.String),
        sa.column('category', sa.String),
        sa.column('logo_text', sa.String),
        sa.column('target', sa.String),
        sa.column('term_years', sa.Integer),
        sa.column('grace_period_months', sa.Integer),
        sa.column('overview', sa.Text),
        sa.column('documents', postgresql.JSONB),
        sa.column('review_days', sa.Integer),
        sa.column('diagnosis_note', sa.Text),
    )
    for name, values in SEED_BACKFILL.items():
        connection.execute(
            products_table.update().where(products_table.c.name == name).values(**values)
        )

    # 백필되지 않은 기존 상품(위 시드 3건 외)이 있다면 화면에서 쓸 수 있게 최소값을 채워둔다.
    op.execute(
        """
        UPDATE financial_products SET
            provider = COALESCE(provider, '미확인'),
            category = COALESCE(category, 'policy'),
            logo_text = COALESCE(logo_text, LEFT(name, 2)),
            target = COALESCE(target, '소상공인 대상'),
            term_years = COALESCE(term_years, 5),
            overview = COALESCE(overview, name),
            documents = COALESCE(documents, '["사업자등록증 사본"]'::jsonb),
            review_days = COALESCE(review_days, 5),
            diagnosis_note = COALESCE(diagnosis_note, '')
        WHERE provider IS NULL
        """
    )

    op.alter_column('financial_products', 'provider', nullable=False)
    op.alter_column('financial_products', 'category', nullable=False)
    op.alter_column('financial_products', 'logo_text', nullable=False)
    op.alter_column('financial_products', 'target', nullable=False)
    op.alter_column('financial_products', 'term_years', nullable=False)
    op.alter_column('financial_products', 'overview', nullable=False)
    op.alter_column('financial_products', 'documents', nullable=False)
    op.alter_column('financial_products', 'review_days', nullable=False)
    op.alter_column('financial_products', 'diagnosis_note', nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('financial_products', 'diagnosis_note')
    op.drop_column('financial_products', 'review_days')
    op.drop_column('financial_products', 'documents')
    op.drop_column('financial_products', 'overview')
    op.drop_column('financial_products', 'grace_period_months')
    op.drop_column('financial_products', 'term_years')
    op.drop_column('financial_products', 'target')
    op.drop_column('financial_products', 'logo_text')
    op.drop_column('financial_products', 'category')
    op.drop_column('financial_products', 'provider')
    # ### end Alembic commands ###
