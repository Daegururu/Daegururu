import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Button, FormModal, StatusChip, Tab } from '@/components/common'
import { AppLayout } from '@/components/layout'
import { InfoCard } from '@/features/mypage/components/InfoCard'
import { NotificationSettings } from '@/features/mypage/components/NotificationSettings'
import { PasswordChangeModal } from '@/features/mypage/components/PasswordChangeModal'
import { StoreProfileForm } from '@/features/mypage/components/StoreProfileForm'
import {
  MOCK_ACCOUNT,
  MOCK_CERTIFICATION,
  MOCK_NOTIFICATION_VALUES,
  MOCK_STORE_PROFILE,
  MOCK_USER,
} from '@/features/mypage/mockData'
import type { MypageTab, NotificationValues, StoreProfile } from '@/features/mypage/types'
import { PATHS } from '@/routes/paths'

type OpenModal = 'password' | 'delete' | null

const TABS: { id: MypageTab; label: string }[] = [
  { id: 'store', label: '가게 정보' },
  { id: 'notification', label: '알림 설정' },
]

/** 10 마이페이지. 10c(알림 설정)는 탭, 10d(비밀번호 변경)는 모달입니다. */
export function MyPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<MypageTab>('store')
  const [openModal, setOpenModal] = useState<OpenModal>(null)
  // TODO: 가게 정보·알림 설정 API 연동. 저장한 값은 화면에서만 유지됩니다.
  const [profile, setProfile] = useState<StoreProfile>(MOCK_STORE_PROFILE)
  const [notifications, setNotifications] = useState<NotificationValues>(MOCK_NOTIFICATION_VALUES)

  const closeModal = () => setOpenModal(null)

  // TODO: 계정 삭제 API 연동. 지금은 확인 후 로그인 화면으로만 보냅니다.
  const handleDeleteAccount = () => navigate(PATHS.login)

  return (
    <AppLayout
      title="마이페이지"
      user={MOCK_USER}
      // 탈퇴는 눈에 띄지 않게 사이드바 맨 아래에 글자 버튼으로만 둡니다.
      sidebarFooter={
        <button
          type="button"
          onClick={() => setOpenModal('delete')}
          className="text-caption text-text-tertiary underline-offset-2 transition-colors hover:text-status-danger hover:underline"
        >
          계정 삭제
        </button>
      }
    >
      <div role="tablist" className="flex items-center gap-6 border-b border-border-default">
        {TABS.map(({ id, label }) => (
          <Tab key={id} active={tab === id} onClick={() => setTab(id)}>
            {label}
          </Tab>
        ))}
      </div>

      {tab === 'store' ? (
        <div className="grid grid-cols-[1fr_364px] items-start gap-6">
          <StoreProfileForm profile={profile} phone={MOCK_ACCOUNT.phone} onSave={setProfile} />

          <div className="flex flex-col gap-4">
            <InfoCard
              title="사업자 인증"
              aside={<StatusChip tone="safe">{MOCK_CERTIFICATION.status}</StatusChip>}
              rows={[
                { label: '사업자등록번호', value: MOCK_CERTIFICATION.businessNumber },
                { label: '대표자명', value: MOCK_CERTIFICATION.ownerName },
                { label: '업태·종목', value: MOCK_CERTIFICATION.businessType },
              ]}
              note={MOCK_CERTIFICATION.note}
            />
            <InfoCard
              title="계정"
              rows={[
                { label: '로그인 아이디', value: MOCK_ACCOUNT.loginId },
                {
                  label: '비밀번호',
                  value: '••••••••',
                  action: (
                    <Button variant="secondary" size="sm" onClick={() => setOpenModal('password')}>
                      변경
                    </Button>
                  ),
                },
                { label: '휴대폰', value: MOCK_ACCOUNT.phone },
              ]}
              note="아이디는 사업자등록번호로 고정됩니다"
            />
          </div>
        </div>
      ) : (
        <NotificationSettings values={notifications} onSave={setNotifications} />
      )}

      <PasswordChangeModal
        open={openModal === 'password'}
        onClose={closeModal}
        onSave={closeModal}
      />

      <FormModal
        open={openModal === 'delete'}
        onClose={closeModal}
        size="md"
        title="계정을 삭제할까요?"
        description="가게 정보 · 진단 이력 · 연동된 계좌와 카드 데이터가 모두 삭제되고 복구할 수 없습니다. 신청 중인 지원사업이 있으면 먼저 취소해야 합니다."
        footer={
          <>
            <Button variant="ghost" onClick={closeModal}>
              취소
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              삭제하기
            </Button>
          </>
        }
      >
        <ul className="flex flex-col gap-1.5 rounded-md bg-bg-subtle px-5 py-4 text-body-s text-text-secondary">
          <li>· 가게 정보와 진단 이력이 모두 삭제됩니다</li>
          <li>· 연동된 계좌와 카드 데이터가 삭제됩니다</li>
          <li>· 같은 사업자등록번호로 다시 가입할 수 있습니다</li>
        </ul>
      </FormModal>
    </AppLayout>
  )
}
