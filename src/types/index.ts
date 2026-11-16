export type Currency = 'MDL' | 'USD' | 'EUR';

export type CompoundingFrequency = 'daily' | 'monthly' | 'quarterly' | 'annually';

export type LoanPaymentFrequency = 'monthly' | 'bi-weekly' | 'annually';

export interface CompoundSavingsInput {
  initialDeposit: number;
  monthlyContribution: number;
  annualRate: number; // in percent e.g. 8.5
  periodYears: number;
  compoundingFrequency: CompoundingFrequency;
}

export interface CompoundSavingsYearData {
  year: number;
  label: string;
  principal: number;
  interest: number;
  totalBalance: number;
  yearlyInterest: number;
}

export interface CompoundSavingsResult {
  totalBalance: number;
  principalInvested: number;
  interestEarned: number;
  yearlyBreakdown: CompoundSavingsYearData[];
}

export interface LoanInput {
  loanAmount: number;
  annualRate: number; // in percent e.g. 6.5
  durationYears: number;
  paymentFrequency: LoanPaymentFrequency;
}

export interface AmortizationScheduleRow {
  paymentNumber: number;
  periodLabel: string;
  paymentAmount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface LoanYearlySummary {
  year: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
}

export interface LoanResult {
  periodicPayment: number;
  totalPayment: number;
  totalInterest: number;
  remainingBalance: number;
  schedule: AmortizationScheduleRow[];
  yearlySummary: LoanYearlySummary[];
}

export interface RiskStatisticsResult {
  count: number;
  mean: number;
  median: number;
  variance: number;
  standardDeviation: number;
  minReturn: number;
  maxReturn: number;
  positiveCount: number;
  negativeCount: number;
  sharpeRatio: number;
  distributionBins: {
    range: string;
    count: number;
    normalDensity: number;
  }[];
}

export interface Scenario {
  id: 'A' | 'B';
  name: string;
  initialDeposit: number;
  monthlyContribution: number;
  annualRate: number;
  periodYears: number;
  compoundingFrequency: CompoundingFrequency;
}

export type SimulatorTab = 'compound' | 'loan' | 'risk';
