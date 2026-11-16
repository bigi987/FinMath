import {
  AmortizationScheduleRow,
  LoanInput,
  LoanPaymentFrequency,
  LoanResult,
  LoanYearlySummary
} from '../types';

export function getPaymentsPerYear(frequency: LoanPaymentFrequency): number {
  switch (frequency) {
    case 'bi-weekly':
      return 26;
    case 'annually':
      return 1;
    case 'monthly':
    default:
      return 12;
  }
}

export function calculateLoan(input: LoanInput): LoanResult {
  const { loanAmount, annualRate, durationYears, paymentFrequency } = input;

  const validPrincipal = Math.max(0, loanAmount || 0);
  const validRate = Math.max(0, annualRate || 0) / 100;
  const validYears = Math.max(0.5, Math.min(50, durationYears || 1));
  const paymentsPerYear = getPaymentsPerYear(paymentFrequency);
  const totalPayments = Math.round(validYears * paymentsPerYear);

  if (validPrincipal === 0 || totalPayments === 0) {
    return {
      periodicPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      remainingBalance: 0,
      schedule: [],
      yearlySummary: [],
    };
  }

  const periodicRate = validRate / paymentsPerYear;

  let periodicPayment = 0;
  if (periodicRate === 0) {
    periodicPayment = validPrincipal / totalPayments;
  } else {
    // Standard Annuity Loan formula: PMT = P * [i(1+i)^n] / [(1+i)^n - 1]
    const factor = Math.pow(1 + periodicRate, totalPayments);
    periodicPayment = (validPrincipal * (periodicRate * factor)) / (factor - 1);
  }

  const schedule: AmortizationScheduleRow[] = [];
  const yearlySummaryMap = new Map<number, { principal: number; interest: number; balance: number }>();

  let currentBalance = validPrincipal;
  let totalInterest = 0;
  let totalPaid = 0;

  for (let i = 1; i <= totalPayments; i++) {
    const interestPart = periodicRate === 0 ? 0 : currentBalance * periodicRate;
    let principalPart = periodicPayment - interestPart;

    // Handle last payment adjustments
    if (i === totalPayments || currentBalance - principalPart < 0.01) {
      principalPart = currentBalance;
      periodicPayment = principalPart + interestPart;
      currentBalance = 0;
    } else {
      currentBalance -= principalPart;
    }

    totalInterest += interestPart;
    totalPaid += (principalPart + interestPart);

    const yearNumber = Math.ceil(i / paymentsPerYear);

    // Format label e.g., "Month 1", "Week 2", "Year 1"
    const periodLabel = paymentFrequency === 'monthly'
      ? `Mo. ${i}`
      : paymentFrequency === 'bi-weekly'
      ? `P. ${i}`
      : `Yr. ${i}`;

    schedule.push({
      paymentNumber: i,
      periodLabel,
      paymentAmount: Number(periodicPayment.toFixed(2)),
      principalPaid: Number(principalPart.toFixed(2)),
      interestPaid: Number(interestPart.toFixed(2)),
      remainingBalance: Number(Math.max(0, currentBalance).toFixed(2)),
    });

    // Aggregate by year
    const existing = yearlySummaryMap.get(yearNumber) || { principal: 0, interest: 0, balance: 0 };
    existing.principal += principalPart;
    existing.interest += interestPart;
    existing.balance = Math.max(0, currentBalance);
    yearlySummaryMap.set(yearNumber, existing);
  }

  const yearlySummary: LoanYearlySummary[] = [
    {
      year: 0,
      principalPaid: 0,
      interestPaid: 0,
      balance: validPrincipal,
    }
  ];

  Array.from(yearlySummaryMap.entries())
    .sort(([a], [b]) => a - b)
    .forEach(([year, data]) => {
      yearlySummary.push({
        year,
        principalPaid: Number(data.principal.toFixed(2)),
        interestPaid: Number(data.interest.toFixed(2)),
        balance: Number(data.balance.toFixed(2)),
      });
    });

  return {
    periodicPayment: Number(periodicPayment.toFixed(2)),
    totalPayment: Number(totalPaid.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    remainingBalance: Number(currentBalance.toFixed(2)),
    schedule,
    yearlySummary,
  };
}
