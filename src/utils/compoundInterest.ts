import {
  CompoundSavingsInput,
  CompoundSavingsResult,
  CompoundSavingsYearData,
  CompoundingFrequency
} from '../types';

export function getCompoundingPeriodsPerYear(frequency: CompoundingFrequency): number {
  switch (frequency) {
    case 'daily':
      return 365;
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'annually':
      return 1;
    default:
      return 12;
  }
}

export function calculateCompoundSavings(input: CompoundSavingsInput): CompoundSavingsResult {
  const { initialDeposit, monthlyContribution, annualRate, periodYears, compoundingFrequency } = input;

  const validInitial = Math.max(0, initialDeposit || 0);
  const validMonthly = Math.max(0, monthlyContribution || 0);
  const validRate = Math.max(0, annualRate || 0) / 100;
  const validYears = Math.max(1, Math.min(60, Math.round(periodYears || 1)));

  const n = getCompoundingPeriodsPerYear(compoundingFrequency);

  // Effective monthly interest rate derived from compounding frequency n
  // (1 + r_monthly)^12 = (1 + r/n)^n
  const monthlyRate = validRate > 0 ? Math.pow(1 + validRate / n, n / 12) - 1 : 0;

  const totalMonths = validYears * 12;
  const yearlyBreakdown: CompoundSavingsYearData[] = [];

  let currentBalance = validInitial;
  let totalPrincipal = validInitial;
  let accumulatedInterest = 0;

  // Year 0 (Today)
  yearlyBreakdown.push({
    year: 0,
    label: 'Today',
    principal: Number(totalPrincipal.toFixed(2)),
    interest: 0,
    totalBalance: Number(currentBalance.toFixed(2)),
    yearlyInterest: 0,
  });

  let previousYearBalance = currentBalance;

  for (let month = 1; month <= totalMonths; month++) {
    // Interest is calculated on the balance before this month's end contribution
    const interestThisMonth = currentBalance * monthlyRate;
    currentBalance += interestThisMonth + validMonthly;
    totalPrincipal += validMonthly;
    accumulatedInterest += interestThisMonth;

    if (month % 12 === 0) {
      const yearNumber = month / 12;
      const yearlyInterestGained = currentBalance - previousYearBalance - validMonthly * 12;
      previousYearBalance = currentBalance;

      yearlyBreakdown.push({
        year: yearNumber,
        label: `Year ${yearNumber}`,
        principal: Number(totalPrincipal.toFixed(2)),
        interest: Number(Math.max(0, accumulatedInterest).toFixed(2)),
        totalBalance: Number(currentBalance.toFixed(2)),
        yearlyInterest: Number(Math.max(0, yearlyInterestGained).toFixed(2)),
      });
    }
  }

  const interestEarned = Math.max(0, currentBalance - totalPrincipal);

  return {
    totalBalance: Number(currentBalance.toFixed(2)),
    principalInvested: Number(totalPrincipal.toFixed(2)),
    interestEarned: Number(interestEarned.toFixed(2)),
    yearlyBreakdown,
  };
}
