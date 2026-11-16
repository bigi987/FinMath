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
import { Currency, LoanInput, LoanPaymentFrequency } from '../../types';
import { calculateLoan } from '../../utils/loanCalculator';
import { formatCurrency, CURRENCY_SYMBOLS } from '../../utils/currency';
import { SliderInput } from '../common/SliderInput';
import { downloadCSV } from '../../utils/csvExport';
import { exportLoanPDF } from '../../utils/pdfExport';
import { useTranslation } from '../../context/LanguageContext';

interface LoanCalculatorProps {
  currency: Currency;
  input: LoanInput;
  onChange: (input: LoanInput) => void;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  currency,
  input,
  onChange,
}) => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<'chart' | 'table'>('chart');
  const [tablePage, setTablePage] = useState<number>(1);
  const rowsPerPage = 12;

  const result = calculateLoan(input);

  const handleUpdate = <K extends keyof LoanInput>(field: K, val: LoanInput[K]) => {
    onChange({
      ...input,
      [field]: val,
    });
  };

  const handleExportCSV = () => {
    const headers = [
      'Payment #',
      t('periodTableCol'),
      `${t('paymentTableCol')} (${currency})`,
      `${t('principalPaidTableCol')} (${currency})`,
      `${t('interestPaidTableCol')} (${currency})`,
      `${t('balanceTableCol')} (${currency})`,
    ];
    const rows = result.schedule.map((r) => [
      r.paymentNumber,
      r.periodLabel,
      r.paymentAmount,
      r.principalPaid,
      r.interestPaid,
      r.remainingBalance,
    ]);
    downloadCSV(`FinMath_Loan_Amortization_${input.durationYears}Y`, headers, rows);
  };

  const handleExportPDF = () => {
    exportLoanPDF({
      currency,
      loanAmount: input.loanAmount,
      annualRate: input.annualRate,
      durationYears: input.durationYears,
      paymentFrequency: input.paymentFrequency,
      periodicPayment: result.periodicPayment,
      totalPayment: result.totalPayment,
      totalInterest: result.totalInterest,
      rows: result.schedule,
    });
  };

  const applyPreset = (preset: {
    amount: number;
    rate: number;
    years: number;
    frequency: LoanPaymentFrequency;
  }) => {
    onChange({
      loanAmount: preset.amount,
      annualRate: preset.rate,
      durationYears: preset.years,
      paymentFrequency: preset.frequency,
    });
    setTablePage(1);
  };

  const totalPages = Math.ceil(result.schedule.length / rowsPerPage);
  const displayedRows = result.schedule.slice(
    (tablePage - 1) * rowsPerPage,
    tablePage * rowsPerPage
  );

  const interestRatio =
    result.totalPayment > 0
      ? Math.min(100, Math.round((result.totalInterest / result.totalPayment) * 100))
      : 0;
  const principalRatio = Math.max(0, 100 - interestRatio);

  const currencyPrefix = CURRENCY_SYMBOLS[currency] !== 'MDL' ? CURRENCY_SYMBOLS[currency] : undefined;

  const frequencies: { id: LoanPaymentFrequency; label: string }[] = [
    { id: 'monthly', label: t('loanFreqMonthly') },
    { id: 'bi-weekly', label: t('loanFreqBiweekly') },
    { id: 'annually', label: t('loanFreqAnnually') },
  ];

  const periodicLabel =
    input.paymentFrequency === 'monthly'
      ? t('monthlyPayment')
      : input.paymentFrequency === 'bi-weekly'
      ? t('biweeklyPayment')
      : t('annualPayment');

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-subtle overflow-hidden">
      {/* Workstation Header Toolbar */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
            {t('loanPresets')}
          </span>
          <button
            type="button"
            onClick={() =>
              applyPreset({ amount: 150000, rate: 6.5, years: 30, frequency: 'monthly' })
            }
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition-colors"
          >
            {t('presetMortgage')}
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({ amount: 25000, rate: 5.5, years: 5, frequency: 'monthly' })
            }
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition-colors"
          >
            {t('presetAuto')}
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({ amount: 10000, rate: 0.0, years: 2, frequency: 'monthly' })
            }
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition-colors"
          >
            {t('presetPromo')}
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
        {/* Left Column: Loan Input Controls (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              {t('loanParams')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('loanParamsSub')}
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <SliderInput
              label={t('loanAmount')}
              value={input.loanAmount}
              onChange={(val) => handleUpdate('loanAmount', val)}
              min={1000}
              max={500000}
              step={1000}
              unit={currency}
              prefix={currencyPrefix}
              tooltip={t('loanAmountTip')}
              minLabel="1,000"
              maxLabel="500,000"
            />

            <SliderInput
              label={t('annualInterestRate')}
              value={input.annualRate}
              onChange={(val) => handleUpdate('annualRate', val)}
              min={0}
              max={25}
              step={0.1}
              unit="%"
              tooltip={t('annualInterestRateTip')}
              minLabel="0.0%"
              maxLabel="25.0%"
            />

            <SliderInput
              label={t('loanDuration')}
              value={input.durationYears}
              onChange={(val) => handleUpdate('durationYears', val)}
              min={1}
              max={35}
              step={1}
              unit={t('yearShort')}
              tooltip={t('loanDurationTip')}
              minLabel={`1 ${t('yearShort')}`}
              maxLabel={`35 ${t('yearsShort')}`}
            />

            {/* Payment Frequency Segmented Control */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block">
                {t('paymentFrequency')}
              </label>
              <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-100 rounded-md border border-slate-200 text-xs">
                {frequencies.map((freq) => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => handleUpdate('paymentFrequency', freq.id)}
                    className={`py-1.5 px-2 rounded text-center transition-colors font-medium text-xs truncate ${
                      input.paymentFrequency === freq.id
                        ? 'bg-white text-slate-900 font-semibold shadow-subtle'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>{t('totalPaymentsLabel')}</span>
              <span className="font-semibold text-slate-800">
                {result.schedule.length} {t('paymentsCount')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Amortization Projection & Metrics (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-6">
          {/* Hero Financial Results Block */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                  {periodicLabel}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono mt-0.5">
                  {formatCurrency(result.periodicPayment, currency)}
                </div>
              </div>

              <div className="text-xs text-slate-500 font-mono">
                {t('annuityInstallment')}
              </div>
            </div>

            {/* Cost Breakdown Proportion Bar */}
            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${principalRatio}%` }}
                  className="bg-slate-400 h-full transition-all duration-300"
                  title={`Principal: ${principalRatio}%`}
                />
                <div
                  style={{ width: `${interestRatio}%` }}
                  className="bg-rose-500 h-full transition-all duration-300"
                  title={`Interest: ${interestRatio}%`}
                />
              </div>

              {/* Two-column summary metrics */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                    <span>{t('loanAmount')}</span>
                    <span className="font-mono text-slate-400">({principalRatio}%)</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-800">
                    {formatCurrency(input.loanAmount, currency)}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                    <span>{t('totalInterest')}</span>
                    <span className="font-mono text-rose-600 font-semibold">({interestRatio}%)</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-rose-600">
                    +{formatCurrency(result.totalInterest, currency)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amortization Chart / Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100 text-xs">
              <span className="font-semibold text-slate-700 tracking-tight">
                {t('loanScheduleTitle')}
              </span>

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
                  <span>{t('balanceDecayBtn')}</span>
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
                  <span>{t('amortizationTableBtn')}</span>
                </button>
              </div>
            </div>

            {/* View rendering */}
            {activeView === 'chart' ? (
              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={result.yearlySummary}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="balanceDecayFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0F172A" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#0F172A" stopOpacity={0.01} />
                      </linearGradient>
                      <linearGradient id="interestCostFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                      axisLine={{ stroke: '#E2E8F0' }}
                      tickLine={false}
                      dy={5}
                      tickFormatter={(val) => (val === 0 ? t('todayLabel') : `Yr ${val}`)}
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
                        name === 'balance'
                          ? t('remainingBalanceLegend')
                          : t('interestPaidLegend'),
                      ]}
                      labelFormatter={(year) => (year === 0 ? t('loanInception') : `${t('yearPrefix')} ${year}`)}
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
                      dataKey="balance"
                      stroke="#0F172A"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#balanceDecayFill)"
                      name="balance"
                    />
                    <Area
                      type="monotone"
                      dataKey="interestPaid"
                      stroke="#F43F5E"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      fillOpacity={1}
                      fill="url(#interestCostFill)"
                      name="interestPaid"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-56 sm:h-64 overflow-y-auto no-scrollbar border border-slate-200 rounded text-xs font-mono">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-2 px-3">{t('periodTableCol')}</th>
                        <th className="py-2 px-3 text-right">{t('paymentTableCol')}</th>
                        <th className="py-2 px-3 text-right">{t('principalPaidTableCol')}</th>
                        <th className="py-2 px-3 text-right">{t('interestPaidTableCol')}</th>
                        <th className="py-2 px-3 text-right">{t('balanceTableCol')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayedRows.map((row) => (
                        <tr key={row.paymentNumber} className="hover:bg-slate-50 transition-colors">
                          <td className="py-1.5 px-3 text-slate-700 font-sans">{row.periodLabel}</td>
                          <td className="py-1.5 px-3 text-right text-slate-800 font-semibold">
                            {formatCurrency(row.paymentAmount, currency)}
                          </td>
                          <td className="py-1.5 px-3 text-right text-slate-600">
                            {formatCurrency(row.principalPaid, currency)}
                          </td>
                          <td className="py-1.5 px-3 text-right text-rose-600">
                            {formatCurrency(row.interestPaid, currency)}
                          </td>
                          <td className="py-1.5 px-3 text-right text-slate-900 font-bold">
                            {formatCurrency(row.remainingBalance, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1">
                  <span>
                    {(tablePage - 1) * rowsPerPage + 1}–
                    {Math.min(tablePage * rowsPerPage, result.schedule.length)} of{' '}
                    {result.schedule.length}
                  </span>
                  <div className="flex items-center gap-1 font-sans">
                    <button
                      type="button"
                      disabled={tablePage === 1}
                      onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-50 text-xs"
                    >
                      {t('prevBtn')}
                    </button>
                    <span className="px-2 font-mono text-slate-700 text-xs">
                      {tablePage}/{totalPages || 1}
                    </span>
                    <button
                      type="button"
                      disabled={tablePage >= totalPages}
                      onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-50 text-xs"
                    >
                      {t('nextBtn')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
