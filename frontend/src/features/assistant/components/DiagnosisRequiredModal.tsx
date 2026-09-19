import { EmptyReportCard, Modal } from '@/components/common'

export interface DiagnosisRequiredModalProps {
  open: boolean
  /** [진단 시작하기]. 홈의 안내 카드와 같은 자리로 보냅니다. */
  onStart: () => void
}

/**
 * 진단 이력이 없을 때(hasReport: false) AI 도우미 위에 덮는 안내 모달입니다.
 *
 * 진단 전에는 답변의 근거가 될 가게 데이터가 없어서 고정비가 0원이라는 답이 나갑니다.
 * 그래서 대화를 막고 진단부터 하도록 보냅니다.
 * 닫기 버튼도 ESC도 없고 [진단 시작하기]로만 빠져나갑니다.
 *
 * 홈에서 쓰는 안내 카드를 그대로 띄웁니다. 문구가 한쪽만 바뀌는 일이 없도록 설명만 바꿔 넘깁니다.
 */
export function DiagnosisRequiredModal({ open, onStart }: DiagnosisRequiredModalProps) {
  return (
    // onClose는 빈 함수입니다. 오버레이를 눌러도 ESC를 눌러도 닫히지 않습니다.
    <Modal open={open} onClose={() => {}} size="lg" padded={false} ariaLabel="진단 시작 안내">
      {/* 모달은 화면 가운데 혼자 뜨는 자리라 홈 카드보다 위아래 여백을 넉넉히 둡니다. */}
      <EmptyReportCard
        onStart={onStart}
        description={
          <>
            AI 도우미는 우리 가게 매출·고정비·정산 데이터를 보고 답해 드려요.
            <br />첫 진단을 마치면 바로 물어볼 수 있어요.
          </>
        }
        className="gap-6 py-20"
      />
    </Modal>
  )
}
