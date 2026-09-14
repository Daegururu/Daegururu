import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Button } from '@/components/common'
import { ApplyLayout } from '@/features/finance/components/ApplyLayout'
import { DocumentUploadSlot } from '@/features/finance/components/DocumentUploadSlot'
import { DOCUMENT_SLOTS, findProduct } from '@/features/finance/mockData'
import { useToast } from '@/hooks/useToast'
import { PATHS, financeApplyDonePath, financeDetailPath } from '@/routes/paths'

/** 09 신청 플로우 · 서류 제출. 정보 확인(1단계)은 08 상세에서 끝난 것으로 봅니다. */
export function FinanceApplyPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const { showToast } = useToast()
  const [files, setFiles] = useState<Record<string, File>>({})

  const product = findProduct(id)

  if (!product) {
    return (
      <ApplyLayout productName="지원사업" currentStep={2} hideSteps>
        <p className="text-body-m text-text-secondary">찾을 수 없는 상품입니다.</p>
        <Button variant="secondary" onClick={() => navigate(PATHS.finance)}>
          금융 지원으로 돌아가기
        </Button>
      </ApplyLayout>
    )
  }

  const isComplete = DOCUMENT_SLOTS.every(({ key }) => files[key])

  // TODO: 서류 업로드·신청 제출·임시저장 API 연동. 지금은 안내만 띄우고 상세로 돌아갑니다.
  const handleSubmit = () => navigate(financeApplyDonePath(product.id))
  const handleSaveDraft = () => {
    showToast('임시 저장되었습니다')
    navigate(financeDetailPath(product.id))
  }

  return (
    <ApplyLayout productName={product.name} currentStep={2}>
      <div className="flex flex-col gap-1.5">
        <h1 className="text-heading-m font-bold text-text-primary">서류를 제출해주세요</h1>
        <p className="text-body-m text-text-secondary">
          PDF 또는 JPG, 파일당 10MB 이하. 발급일 30일 이내 서류만 인정됩니다.
        </p>
      </div>

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
