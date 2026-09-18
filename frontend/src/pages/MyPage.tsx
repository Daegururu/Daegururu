import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Button, FormModal, PasswordInput, StatusCard, StatusChip, Tab } from '@/components/common'
import { AppLayout } from '@/components/layout'
import { InfoCard } from '@/features/mypage/components/InfoCard'
import { NotificationSettings } from '@/features/mypage/components/NotificationSettings'
import { PasswordChangeModal } from '@/features/mypage/components/PasswordChangeModal'
import { StoreProfileForm } from '@/features/mypage/components/StoreProfileForm'
import {
  useChangePassword,
  useDeleteAccount,
  useMypage,
  useUpdateStore,
} from '@/features/mypage/hooks/useMypage'
import { MOCK_NOTIFICATION_VALUES } from '@/features/mypage/mockData'
import type { MypageTab, NotificationValues } from '@/features/mypage/types'
import { useToast } from '@/hooks/useToast'
import { PATHS } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

type OpenModal = 'password' | 'delete' | null

const TABS: { id: MypageTab; label: string }[] = [
  { id: 'store', label: '가게 정보' },
  { id: 'notification', label: '알림 설정' },
]

/** 10 마이페이지. 10c(알림 설정)는 탭, 10d(비밀번호 변경)는 모달입니다. */
export function MyPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const userLabel = user ? `${user.representativeName} 사장님` : ''

  const [tab, setTab] = useState<MypageTab>('store')
  const [openModal, setOpenModal] = useState<OpenModal>(null)
  // TODO: 알림 설정 API 연동. 아직 백엔드에 없어 저장한 값은 화면에서만 유지됩니다.
  const [notifications, setNotifications] = useState<NotificationValues>(MOCK_NOTIFICATION_VALUES)

  const mypage = useMypage()
  const updateStore = useUpdateStore()
  const changePassword = useChangePassword()
  const removeAccount = useDeleteAccount()

  // 탈퇴 모달의 비밀번호 입력. 서버가 대조하고, 틀리면 그 문구를 칸 아래에 보여줍니다.
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const closeModal = () => {
    setOpenModal(null)
    setDeletePassword('')
    setDeleteError('')
  }

  const handlePasswordSave = async (current: string, next: string) => {
    await changePassword.mutateAsync({ current, next })
    closeModal()
    showToast('비밀번호가 변경되었습니다')
  }

  // 서버가 계정과 쿠키를 지운 뒤에 프론트 상태를 비웁니다. 비밀번호가 틀리면 모달에 남습니다.
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('비밀번호를 입력해주세요')
      return
    }
    try {
      await removeAccount.mutateAsync(deletePassword)
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : '계정을 삭제하지 못했습니다')
      return
    }
    clearAuth()
    navigate(PATHS.login, { replace: true })
  }

  const renderStoreTab = () => {
    if (mypage.isPending) {
      return <StatusCard loading loadingMessage="가게 정보를 불러오는 중이에요..." />
    }
    if (mypage.isError) {
      return <StatusCard errorMessage={mypage.error.message} onRetry={() => mypage.refetch()} />
    }

    const { profile, certification, account } = mypage.data

    return (
      <div className="grid grid-cols-[1fr_364px] items-start gap-6">
        {/* 저장 뒤 다시 불러온 값으로 폼을 새로 그리도록 값이 바뀌면 key도 바뀝니다. */}
        <StoreProfileForm
          key={Object.values(profile).join('|')}
          profile={profile}
          onSave={async (next) => {
            await updateStore.mutateAsync(next)
            showToast('가게 정보가 저장되었습니다')
          }}
          saving={updateStore.isPending}
          submitError={updateStore.error?.message}
        />

        <div className="flex flex-col gap-4">
          {/* 인증 상태는 회원가입 때 낸 사업자등록증 기준입니다. 국세청 진위확인은 아직 없습니다. */}
          <InfoCard
            title="사업자 인증"
            aside={<StatusChip tone="safe">인증 완료</StatusChip>}
            rows={[
              { label: '사업자등록번호', value: certification.businessNumber },
              { label: '대표자명', value: certification.ownerName },
              { label: '업태·종목', value: certification.businessType || '-' },
            ]}
            note="회원가입 때 제출한 사업자등록증 기준"
          />
          <InfoCard
            title="계정"
            rows={[
              { label: '로그인 아이디', value: account.loginId },
              {
                label: '비밀번호',
                value: '••••••••',
                action: (
                  <Button variant="secondary" size="sm" onClick={() => setOpenModal('password')}>
                    변경
                  </Button>
                ),
              },
              { label: '휴대폰', value: account.phone },
            ]}
            note="아이디는 사업자등록번호로 고정됩니다"
          />
        </div>
      </div>
    )
  }

  return (
    <AppLayout
      title="마이페이지"
      user={userLabel}
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
        renderStoreTab()
      ) : (
        <NotificationSettings values={notifications} onSave={setNotifications} />
      )}

      <PasswordChangeModal
        open={openModal === 'password'}
        onClose={closeModal}
        onSave={handlePasswordSave}
        saving={changePassword.isPending}
      />

      <FormModal
        open={openModal === 'delete'}
        onClose={closeModal}
        size="md"
        title="계정을 삭제할까요?"
        description="가게 정보 · 진단 이력 · 매출·정산 데이터가 모두 삭제되고 복구할 수 없습니다. 확인을 위해 비밀번호를 입력해주세요."
        footer={
          <>
            <Button variant="ghost" onClick={closeModal} disabled={removeAccount.isPending}>
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={removeAccount.isPending}
            >
              {removeAccount.isPending ? '삭제 중...' : '삭제하기'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <ul className="flex flex-col gap-1.5 rounded-md bg-bg-subtle px-5 py-4 text-body-s text-text-secondary">
            <li>· 가게 정보와 진단 이력이 모두 삭제됩니다</li>
            <li>· 입력한 매출·정산 데이터가 삭제됩니다</li>
            <li>· 같은 사업자등록번호로 다시 가입할 수 있습니다</li>
          </ul>
          <PasswordInput
            label="비밀번호"
            value={deletePassword}
            onChange={(event) => {
              setDeletePassword(event.target.value)
              setDeleteError('')
            }}
            errorMessage={deleteError}
            autoComplete="current-password"
          />
        </div>
      </FormModal>
    </AppLayout>
  )
}
