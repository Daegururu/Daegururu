export interface DiagnosisReport {
  report_id: number;
  user_id: number;
  diagnosis_date: string;
  composite_score: number;
  risk_level: "안전" | "주의" | "위험";
  sub_scores: {
    sales: number;
    cost_structure: number;
    cashflow: number;
    settlement: number;
    relative_position: number;
  };
  causes: DiagnosisCause[];
  prescriptions: Prescription[];
}

export interface DiagnosisCause {
  cause_id: number;
  area: string;
  summary: string;
  evidence: string[];
}

export interface Prescription {
  prescription_id: number;
  rank: number;
  type: string;
  title: string;
  status: "제안됨" | "실행중" | "완료";
  executed_at: string | null;
}

export interface Transaction {
  transaction_id: number;
  date: string;
  type: "매출" | "고정비" | "변동비";
  category: string | null;
  amount: number;
  settlement_date: string | null;
  fee_rate: number | null;
}

export interface FinancialProduct {
  product_id: number;
  name: string;
  provider: string;
  type: string;
  limit_amount: number;
  interest_rate: number;
  period_years: number;
  grace_period_years: number;
  required_documents: string[];
  eligibility_rules: Record<string, unknown>;
}

export interface ChatMessage {
  message_id: number;
  role: "user" | "ai";
  content: string;
  created_at: string;
}

export interface User {
  user_id: number;
  business_reg_no: string;
  business_name: string;
  representative_name: string;
  industry_code: string;
  region_code: string;
  open_date: string;
  phone: string;
}
