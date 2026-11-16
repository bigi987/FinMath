import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CompoundSavingsInput, Currency } from '../../types';
import { calculateCompoundSavings } from '../../utils/compoundInterest';
import { formatCurrency, CURRENCY_SYMBOLS } from '../../utils/currency';
import { SliderInput } from '../common/SliderInput';
import { useTranslation } from '../../context/LanguageContext';

interface CompareSectionProps {
  currency: Currency;
  scenarioA: CompoundSavingsInput;
  scenarioB: CompoundSavingsInput;
  onChangeA: (input: CompoundSavingsInput) => void;
  onChangeB: (input: CompoundSavingsInput) => void;
}

export const CompareSection: React.FC<CompareSectionProps> = ({
  currency,
  scenarioA,
  scenarioB,
  onChangeA,
  onChangeB,
}) => {
  const { t } = useTranslation();
  const resultA = calculateCompoundSavings(scenarioA);
  const resultB = calculateCompoundSavings(scenarioB);

  const maxYears = Math.max(scenarioA.periodYears, scenarioB.periodYears);

  const combinedData = [];
  for (let yr = 0; yr <= maxYears; yr++) {
    const itemA = resultA.yearlyBreakdown.find((d) => d.year === yr);
    const itemB = resultB.yearlyBreakdown.find((d) => d.year === yr);
    const lastA = resultA.yearlyBreakdown[resultA.yearlyBreakdown.length - 1]?.totalBalance || 0;
    const lastB = resultB.yearlyBreakdown[resultB.yearlyBreakdown.length - 1]?.totalBalance || 0;

    combinedData.push({
      year: yr,
      label: yr === 0 ? t('todayLabel') : `${t('yearPrefix')} ${yr}`,
      scenarioA: itemA ? itemA.totalBalance : lastA,
      scenarioB: itemB ? itemB.totalBalance : lastB,
      principalA: itemA ? itemA.principal : resultA.principalInvested,
      principalB: itemB ? itemB.principal : resultB.principalInvested,
    });
  }

  const diffBalance = resultB.totalBalance - resultA.totalBalance;
  const pctDiff =
    resultA.totalBalance > 0
      ? ((diffBalance / resultA.totalBalance) * 100).toFixed(1)
      : '0.0';

  const diffInterest = resultB.interestEarned - resultA.interestEarned;
  const currencyPrefix = CURRENCY_SYMBOLS[currency] !== 'MDL' ? CURRENCY_SYMBOLS[currency] : undefined;

  return (
    <section id="compare" className="pt-6 pb-12">
      <div className="space-y-4">
        {/* Section Header */}
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {t('compareSectionTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate sensitivity to initial capital, monthly deposit rate, and return differentials.
          </p>
        </div>

        {/* Unified Comparison Console */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-subtle overflow-hidden">
          {/* Top Delta Callout Banner */}
          <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block font-mono">
                  {t('balanceDelta')}
                </span>
                <div
                  className={`text-base font-bold font-mono flex items-center gap-1 ${
                    diffBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {diffBalance >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>
                    {diffBalance >= 0 ? '+' : ''}
                    {formatCurrency(diffBalance, currency)}
                  </span>
                  <span className="text-xs opacity-75">({pctDiff}%)</span>
                </div>
              </div>

              <div className="border-l border-slate-200 pl-6 hidden sm:block">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block font-mono">
                  {t('interestDelta')}
                </span>
                <span
                  className={`text-sm font-bold font-mono ${
                    diffInterest >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {diffInterest >= 0 ? '+' : ''}
                  {formatCurrency(diffInterest, currency)}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Scenario B vs Baseline Scenario A
            </div>
          </div>

          {/* Dual Input Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-5 sm:p-6 gap-6 md:gap-0">
            {/* Scenario A Controls */}
            <div className="md:pr-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                  <h3 className="font-bold text-slate-900 text-sm">{t('scenarioA')} (Baseline)</h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-900">
                  {formatCurrency(resultA.totalBalance, currency)}
                </span>
              </div>

              <div className="space-y-4">
                <SliderInput
                  label={t('initialDeposit')}
                  value={scenarioA.initialDeposit}
                  onChange={(val) => onChangeA({ ...scenarioA, initialDeposit: val })}
                  min={0}
                  max={10000}
                  step={50}
                  unit={currency}
                  prefix={currencyPrefix}
                  minLabel="0"
                  maxLabel="10,000"
                />
                <SliderInput
                  label={t('monthlyContribution')}
                  value={scenarioA.monthlyContribution}
                  onChange={(val) => onChangeA({ ...scenarioA, monthlyContribution: val })}
                  min={0}
                  max={2000}
                  step={10}
                  unit={currency}
                  prefix={currencyPrefix}
                  minLabel="0"
                  maxLabel="2,000"
                />
                <SliderInput
                  label={t('annualRate')}
                  value={scenarioA.annualRate}
                  onChange={(val) => onChangeA({ ...scenarioA, annualRate: val })}
                  min={0}
                  max={25}
                  step={0.1}
                  unit="%"
                  minLabel="0%"
                  maxLabel="25%"
                />
                <SliderInput
                  label={t('period')}
                  value={scenarioA.periodYears}
                  onChange={(val) => onChangeA({ ...scenarioA, periodYears: val })}
                  min={1}
                  max={40}
                  step={1}
                  unit={t('yearShort')}
                  minLabel={`1 ${t('yearShort')}`}
                  maxLabel={`40 ${t('yearsShort')}`}
                />
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-400 block text-[10px] uppercase">{t('principalInvested')}</span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(resultA.principalInvested, currency)}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-400 block text-[10px] uppercase">{t('interestEarned')}</span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(resultA.interestEarned, currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Scenario B Controls */}
            <div className="md:pl-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">{t('scenarioB')} (Alternative)</h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  {formatCurrency(resultB.totalBalance, currency)}
                </span>
              </div>

              <div className="space-y-4">
                <SliderInput
                  label={t('initialDeposit')}
                  value={scenarioB.initialDeposit}
                  onChange={(val) => onChangeB({ ...scenarioB, initialDeposit: val })}
                  min={0}
                  max={10000}
                  step={50}
                  unit={currency}
                  prefix={currencyPrefix}
                  minLabel="0"
                  maxLabel="10,000"
                />
                <SliderInput
                  label={t('monthlyContribution')}
                  value={scenarioB.monthlyContribution}
                  onChange={(val) => onChangeB({ ...scenarioB, monthlyContribution: val })}
                  min={0}
                  max={2000}
                  step={10}
                  unit={currency}
                  prefix={currencyPrefix}
                  minLabel="0"
                  maxLabel="2,000"
                />
                <SliderInput
                  label={t('annualRate')}
                  value={scenarioB.annualRate}
                  onChange={(val) => onChangeB({ ...scenarioB, annualRate: val })}
                  min={0}
                  max={25}
                  step={0.1}
                  unit="%"
                  minLabel="0%"
                  maxLabel="25%"
                />
                <SliderInput
                  label={t('period')}
                  value={scenarioB.periodYears}
                  onChange={(val) => onChangeB({ ...scenarioB, periodYears: val })}
                  min={1}
                  max={40}
                  step={1}
                  unit={t('yearShort')}
                  minLabel={`1 ${t('yearShort')}`}
                  maxLabel={`40 ${t('yearsShort')}`}
                />
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-400 block text-[10px] uppercase">{t('principalInvested')}</span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(resultB.principalInvested, currency)}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-400 block text-[10px] uppercase">{t('interestEarned')}</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(resultB.interestEarned, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Combined Trajectory Chart */}
          <div className="border-t border-slate-200 p-5 sm:p-6 space-y-3 bg-slate-50/30">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 tracking-tight">
                {t('compareChartTitle')}
              </span>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-0.5 bg-slate-900 inline-block" />
                  <span>{t('scenarioA')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-2.5 h-0.5 bg-emerald-500 inline-block" />
                  <span>{t('scenarioB')}</span>
                </div>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                    dy={5}
                  />
                  <YAxis
                    width={52}
                    tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) =>
                      formatCurrency(val, currency, { compact: true, symbolPrefix: true })
                    }
                  />
                  <RechartsTooltip
                    formatter={(val: any, name: string) => [
                      formatCurrency(Number(val), currency),
                      name === 'scenarioA' ? t('scenarioA') : t('scenarioB'),
                    ]}
                    labelFormatter={(label) => `${t('timelineCol')}: ${label}`}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '0.375rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                      color: '#F8FAFC',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      padding: '8px 12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="scenarioA"
                    stroke="#0F172A"
                    strokeWidth={2}
                    dot={false}
                    name="scenarioA"
                  />
                  <Line
                    type="monotone"
                    dataKey="scenarioB"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={false}
                    name="scenarioB"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
