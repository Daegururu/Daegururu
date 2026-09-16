import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Button } from '@/components/common'
import { ApplyLayout } from '@/features/finance/components/ApplyLayout'
import { DocumentUploadSlot } from '@/features/finance/components/DocumentUploadSlot'
import { DOCUMENT_SLOTS } from '@/features/finance/constants'
import { useFinanceProduct } from '@/features/finance/hooks/useFinance'
import { parseProductId } from '@/features/finance/mapping'
import { useToast } from '@/hooks/useToast'
import { PATHS, financeApplyDonePath, financeDetailPath } from '@/routes/paths'

/** 09 신청 플로우 · 서류 제출. 정보 확인(1단계)은 08 상세에서 끝난 것으로 봅니다. */
export function FinanceApplyPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const { showToast } = useToast()
  const [files, setFiles] = useState<Record<string, File>>({})

  // 상품명만 API에서 받습니다. 상세를 거쳐 들어오므로 보통 캐시에 있습니다.
  const productId = parseProductId(id)
  const product = useFinanceProduct(productId)

  if (productId === null || product.isError) {
    return (
      <ApplyLayout productName="지원사업" currentStep={2} hideSteps>
        <p className="text-body-m text-text-secondary">찾을 수 없는 상품입니다.</p>
        <Button variant="secondary" onClick={() => navigate(PATHS.finance)}>
          금융 지원으로 돌아가기
        </Button>
      </ApplyLayout>
    )
  }

  const productName = product.data?.name ?? '지원사업'
  const isComplete = DOCUMENT_SLOTS.every(({ key }) => files[key])

  // TODO: 서류 업로드·신청 제출·임시저장 API는 후순위입니다. 지금은 안내만 띄우고 화면만 이동합니다.
  const handleSubmit = () => navigate(financeApplyDonePath(id))
  const handleSaveDraft = () => {
    showToast('임시 저장되었습니다')
    navigate(financeDetailPath(id))
  }

  return (
    <ApplyLayout productName={productName} currentStep={2}>
      <div className="flex flex-col gap-1.5">
        <h1 className="text-heading-m font-bold text-text-primary">서류를 제출해주세요</h1>
        <p className="text-body-m text-text-secondary">
          PDF 또는 JPG, 파일당 10MB 이하. 발급일 30일 이내 서류만 인정됩니다.
        </p>
      </div>

      {/* 신청 API 연동 전이라 서류는 서버로 가지 않습니다. API가 붙으면 이 안내를 지웁니다. */}
      <p
        role="note"
        className="rounded-md border border-status-warn bg-status-warn-bg px-4 py-3 text-body-s text-text-secondary"
      >
        신청 접수 기능은 준비 중입니다. 지금은 화면 흐름만 확인할 수 있고 서류는 저장되지 않습니다.
      </p>

      <div className="flex flex-col gap-3">
        {DOCUMENT_SLOTS.map(({ key, label, hint }) => (
          <DocumentUploadSlot
            key={key}
            label={label}
            hint={hint}
            file={files[key] ?? null}
            onFileSelect={(file) => setFiles((prev) => ({ ...prev, [key]: file }))}
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={handleSaveDraft}>
          임시저장
        </Button>
        <Button disabled={!isComplete} onClick={handleSubmit}>
          제출하기
        </Button>
      </div>
    </ApplyLayout>
  )
}
