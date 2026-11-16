import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  FileSpreadsheet,
  FileText,
  Table as TableIcon,
  LineChart as ChartIcon,
} from 'lucide-react';
import { CompoundSavingsInput, CompoundingFrequency, Currency } from '../../types';
import { calculateCompoundSavings } from '../../utils/compoundInterest';
import { formatCurrency, CURRENCY_SYMBOLS } from '../../utils/currency';
import { SliderInput } from '../common/SliderInput';
import { downloadCSV } from '../../utils/csvExport';
import { exportSavingsPDF } from '../../utils/pdfExport';
import { useTranslation } from '../../context/LanguageContext';

interface CompoundSavingsProps {
  currency: Currency;
  input: CompoundSavingsInput;
  onChange: (input: CompoundSavingsInput) => void;
  activeScenarioId?: 'A' | 'B';
  onScenarioToggle?: (id: 'A' | 'B') => void;
}

export const CompoundSavings: React.FC<CompoundSavingsProps> = ({
  currency,
  input,
  onChange,
  activeScenarioId = 'A',
  onScenarioToggle,
}) => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<'chart' | 'table'>('chart');

  const result = calculateCompoundSavings(input);

  const handleUpdate = <K extends keyof CompoundSavingsInput>(
    field: K,
    val: CompoundSavingsInput[K]
  ) => {
    onChange({
      ...input,
      [field]: val,
    });
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      t('timelineCol'),
      `${t('principalCol')} (${currency})`,
      `${t('interestCol')} (${currency})`,
      `${t('balanceCol')} (${currency})`,
    ];
    const rows = result.yearlyBreakdown.map((row) => [
      row.label,
      row.principal,
      row.interest,
      row.totalBalance,
    ]);
    downloadCSV(`FinMath_Compound_Savings_${input.periodYears}Y`, headers, rows);
  };

  // PDF Export
  const handleExportPDF = () => {
    exportSavingsPDF({
      currency,
      initialDeposit: input.initialDeposit,
      monthlyContribution: input.monthlyContribution,
      annualRate: input.annualRate,
      periodYears: input.periodYears,
      compoundingFrequency: input.compoundingFrequency,
      totalBalance: result.totalBalance,
      principalInvested: result.principalInvested,
      interestEarned: result.interestEarned,
      rows: result.yearlyBreakdown,
    });
  };

  // Quick benchmark presets
  const applyPreset = (preset: {
    initial: number;
    monthly: number;
    rate: number;
    years: number;
    freq: CompoundingFrequency;
  }) => {
    onChange({
      initialDeposit: preset.initial,
      monthlyContribution: preset.monthly,
      annualRate: preset.rate,
      periodYears: preset.years,
      compoundingFrequency: preset.freq,
    });
  };

  const principalRatio =
    result.totalBalance > 0
      ? Math.min(100, Math.round((result.principalInvested / result.totalBalance) * 100))
      : 0;
  const interestRatio = Math.max(0, 100 - principalRatio);

  const currencyPrefix = CURRENCY_SYMBOLS[currency] !== 'MDL' ? CURRENCY_SYMBOLS[currency] : undefined;

  const frequencies: { id: CompoundingFrequency; label: string }[] = [
    { id: 'monthly', label: t('freqMonthly') },
    { id: 'quarterly', label: t('freqQuarterly') },
    { id: 'annually', label: t('freqAnnually') },
    { id: 'daily', label: t('freqDaily') },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-subtle overflow-hidden">
      {/* Workstation Header Toolbar */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
            {t('quickPresets')}
          </span>
          <button
            type="button"
            onClick={() =>
              applyPreset({ initial: 555.56, monthly: 83.33, rate: 8.5, years: 10, freq: 'monthly' })
            }
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition-colors"
          >
            {t('presetRef')}
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({ initial: 1000, monthly: 250, rate: 7.0, years: 20, freq: 'monthly' })
            }
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition-colors"
          >
            {t('presetIndex')}
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({ initial: 5000, monthly: 500, rate: 10.0, years: 25, freq: 'annually' })
            }
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition-colors"
          >
            {t('presetWealth')}
          </button>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded font-medium transition-colors"
            title="Download CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded font-medium transition-colors"
            title="Download PDF"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Main Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column: Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              {t('buildScenario')}
            </h3>
            <p className="text-xs text-slate-500">
              Adjust capital deposits, annual interest rates, and compounding frequency.
            </p>
          </div>

          {/* Group 1: Capital Inflow */}
          <div className="space-y-4 pt-1">
            <SliderInput
              label={t('initialDeposit')}
              value={input.initialDeposit}
              onChange={(val) => handleUpdate('initialDeposit', val)}
              min={0}
              max={10000}
              step={50}
              unit={currency}
              prefix={currencyPrefix}
              tooltip={t('initialDepositTip')}
              minLabel="0"
              maxLabel="10,000"
            />

            <SliderInput
              label={t('monthlyContribution')}
              value={input.monthlyContribution}
              onChange={(val) => handleUpdate('monthlyContribution', val)}
              min={0}
              max={2000}
              step={10}
              unit={currency}
              prefix={currencyPrefix}
              tooltip={t('monthlyContributionTip')}
              minLabel="0"
              maxLabel="2,000"
            />
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <SliderInput
              label={t('annualRate')}
              value={input.annualRate}
              onChange={(val) => handleUpdate('annualRate', val)}
              min={0}
              max={25}
              step={0.1}
              unit="%"
              tooltip={t('annualRateTip')}
              minLabel="0.0%"
              maxLabel="25.0%"
            />

            <SliderInput
              label={t('period')}
              value={input.periodYears}
              onChange={(val) => handleUpdate('periodYears', val)}
              min={1}
              max={40}
              step={1}
              unit={t('yearShort')}
              tooltip={t('periodTip')}
              minLabel={`1 ${t('yearShort')}`}
              maxLabel={`40 ${t('yearsShort')}`}
            />

            {/* Compounding Frequency Segmented Control */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block">
                {t('compounding')}
              </label>
              <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-100 rounded-md border border-slate-200 text-xs">
                {frequencies.map((freq) => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => handleUpdate('compoundingFrequency', freq.id)}
                    className={`py-1.5 px-2 rounded text-center transition-colors font-medium text-xs truncate ${
                      input.compoundingFrequency === freq.id
                        ? 'bg-white text-slate-900 font-semibold shadow-subtle'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Projection & Analysis (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-6">
          {/* Hero Financial Results Block */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                  {t('totalBalance')}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono mt-0.5">
                  {formatCurrency(result.totalBalance, currency)}
                </div>
              </div>

              <div className="text-xs text-slate-500 font-mono">
                {t('afterPeriod')} <span className="text-slate-900 font-semibold">{input.periodYears}</span>{' '}
                {input.periodYears === 1 ? t('yearUnit') : t('yearsUnit')}
              </div>
            </div>

            {/* Asset Composition Proportion Bar */}
            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${principalRatio}%` }}
                  className="bg-slate-400 h-full transition-all duration-300"
                  title={`Principal: ${principalRatio}%`}
                />
                <div
                  style={{ width: `${interestRatio}%` }}
                  className="bg-emerald-500 h-full transition-all duration-300"
                  title={`Interest: ${interestRatio}%`}
                />
              </div>

              {/* Two-column summary metrics */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                    <span>{t('principalInvested')}</span>
                    <span className="font-mono text-slate-400">({principalRatio}%)</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-800">
                    {formatCurrency(result.principalInvested, currency)}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span>{t('interestEarned')}</span>
                    <span className="font-mono text-emerald-600 font-semibold">({interestRatio}%)</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-600">
                    +{formatCurrency(result.interestEarned, currency)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart & Table Visualization */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100 text-xs">
              <span className="font-semibold text-slate-700 tracking-tight">
                {t('moneyOverTime')}
              </span>

              <div className="flex items-center gap-2">
                {onScenarioToggle && (
                  <div className="flex items-center p-0.5 bg-slate-100 rounded border border-slate-200 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => onScenarioToggle('A')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        activeScenarioId === 'A'
                          ? 'bg-white text-slate-900 font-bold shadow-subtle'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => onScenarioToggle('B')}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        activeScenarioId === 'B'
                          ? 'bg-white text-slate-900 font-bold shadow-subtle'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      B
                    </button>
                  </div>
                )}

                <div className="flex items-center p-0.5 bg-slate-100 rounded border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveView('chart')}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                      activeView === 'chart'
                        ? 'bg-white text-slate-900 font-semibold shadow-subtle'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <ChartIcon className="w-3.5 h-3.5" />
                    <span>{t('chartView')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('table')}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                      activeView === 'table'
                        ? 'bg-white text-slate-900 font-semibold shadow-subtle'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>{t('tableView')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Projection Chart / Table */}
            {activeView === 'chart' ? (
              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={result.yearlyBreakdown}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0F172A" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#0F172A" stopOpacity={0.01} />
                      </linearGradient>
                      <linearGradient id="principalFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#94A3B8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
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
                      domain={[0, 'auto']}
                    />
                    <RechartsTooltip
                      formatter={(val: any, name: string) => [
                        formatCurrency(Number(val), currency),
                        name === 'totalBalance' ? t('totalBalance') : t('principalInvested'),
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
                    <Area
                      type="monotone"
                      dataKey="principal"
                      stroke="#94A3B8"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#principalFill)"
                      name="principal"
                    />
                    <Area
                      type="monotone"
                      dataKey="totalBalance"
                      stroke="#0F172A"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#balanceFill)"
                      name="totalBalance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 sm:h-72 overflow-y-auto no-scrollbar border border-slate-200 rounded text-xs font-mono">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2 px-3">{t('timelineCol')}</th>
                      <th className="py-2 px-3 text-right">{t('principalCol')}</th>
                      <th className="py-2 px-3 text-right">{t('interestCol')}</th>
                      <th className="py-2 px-3 text-right">{t('balanceCol')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                        <td className="py-1.5 px-3 text-slate-700 font-sans">{row.label}</td>
                        <td className="py-1.5 px-3 text-right text-slate-600">
                          {formatCurrency(row.principal, currency)}
                        </td>
                        <td className="py-1.5 px-3 text-right text-emerald-600">
                          +{formatCurrency(row.interest, currency)}
                        </td>
                        <td className="py-1.5 px-3 text-right font-bold text-slate-900">
                          {formatCurrency(row.totalBalance, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
