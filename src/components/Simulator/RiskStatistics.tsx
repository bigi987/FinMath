import React, { useState } from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import {
  Plus,
  Trash2,
  FileSpreadsheet,
} from 'lucide-react';
import { calculateStatistics } from '../../utils/statistics';
import { downloadCSV } from '../../utils/csvExport';
import { useTranslation } from '../../context/LanguageContext';

const DATASET_PRESETS: { name: string; returns: number[]; description: string }[] = [
  {
    name: 'S&P 500 (2015–2024)',
    returns: [1.4, 11.9, 21.8, -4.4, 31.5, 18.4, 28.7, -18.1, 26.3, 24.0],
    description: '10-year historical annual returns of the US large-cap benchmark.',
  },
  {
    name: 'Tech Growth Portfolio',
    returns: [8.5, 27.2, 38.9, -1.5, 35.2, 43.6, 21.4, -33.1, 53.8, 30.5],
    description: 'High-volatility growth strategy with potential for large swings.',
  },
  {
    name: 'Conservative Bond Fund',
    returns: [2.1, 3.2, 3.5, 0.9, 8.7, 7.5, -1.5, -13.0, 5.5, 4.2],
    description: 'Fixed-income balanced allocation focused on capital preservation.',
  },
];

export const RiskStatistics: React.FC = () => {
  const { t } = useTranslation();
  const [returnsList, setReturnsList] = useState<number[]>(DATASET_PRESETS[0].returns);
  const [newValue, setNewValue] = useState<string>('');
  const [riskFreeRate, setRiskFreeRate] = useState<number>(2.0);

  const stats = calculateStatistics(returnsList, riskFreeRate);

  const handleAddValue = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(newValue);
    if (!isNaN(parsed)) {
      setReturnsList([...returnsList, parsed]);
      setNewValue('');
    }
  };

  const handleRemoveValue = (index: number) => {
    setReturnsList(returnsList.filter((_, i) => i !== index));
  };

  const handleResetToPreset = (preset: typeof DATASET_PRESETS[0]) => {
    setReturnsList(preset.returns);
  };

  const handleExportCSV = () => {
    const headers = ['Period Index', 'Return Rate (%)'];
    const rows = returnsList.map((val, idx) => [`Period ${idx + 1}`, `${val}%`]);
    downloadCSV('FinMath_Risk_Statistics', headers, rows);
  };

  const getRiskCategory = (sd: number) => {
    if (sd < 6) return { label: t('lowVolatility'), color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (sd < 15) return { label: t('moderateVolatility'), color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: t('highVolatility'), color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const riskBadge = getRiskCategory(stats.standardDeviation);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-subtle overflow-hidden">
      {/* Workstation Header Toolbar */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
            {t('marketDatasets')}
          </span>
          {DATASET_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleResetToPreset(preset)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded font-medium transition-colors"
          title="Download dataset as CSV"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
          <span>CSV</span>
        </button>
      </div>

      {/* Main Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column: Data Input (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              {t('returnsPointsTitle')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('returnsPointsSub')}
            </p>
          </div>

          {/* Add Return Form */}
          <form onSubmit={handleAddValue} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 14.5"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 text-sm font-mono bg-white border border-slate-300 rounded-md shadow-subtle focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                %
              </span>
            </div>
            <button
              type="submit"
              disabled={newValue === ''}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-md text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('addBtn')}</span>
            </button>
          </form>

          {/* List of Data Points */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{t('valuesCount')} ({returnsList.length} {t('itemsCount')})</span>
              {returnsList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setReturnsList([])}
                  className="text-slate-500 hover:text-rose-600 text-xs transition-colors font-medium"
                >
                  {t('clearAllBtn')}
                </button>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto no-scrollbar border border-slate-200 rounded-md p-2 bg-slate-50/50 flex flex-wrap gap-1.5">
              {returnsList.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center w-full">
                  {t('noDataPoints')}
                </p>
              ) : (
                returnsList.map((val, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium bg-white border border-slate-200 text-slate-800 shadow-subtle group"
                  >
                    <span className={val >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      {val >= 0 ? `+${val}%` : `${val}%`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveValue(idx)}
                      className="text-slate-300 hover:text-rose-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Risk-free benchmark rate */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">{t('riskFreeRateLabel')}</span>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                step="0.5"
                value={riskFreeRate}
                onChange={(e) => setRiskFreeRate(parseFloat(e.target.value) || 0)}
                className="w-14 text-right px-2 py-1 text-xs border border-slate-200 rounded font-semibold text-slate-900 bg-white"
              />
              <span className="text-slate-400">%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Statistics Grid & Distribution Histogram (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-6">
          {/* Key Result Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded">
              <span className="text-[11px] text-slate-500 font-medium block">{t('meanExpected')}</span>
              <div
                className={`text-xl font-bold font-mono mt-0.5 ${
                  stats.mean >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {stats.mean >= 0 ? `+${stats.mean}%` : `${stats.mean}%`}
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">{t('averageReturn')}</span>
            </div>

            <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded">
              <span className="text-[11px] text-slate-500 font-medium block">{t('stdDev')}</span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                {stats.standardDeviation}%
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">{t('volatilityMetric')}</span>
            </div>

            <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded">
              <span className="text-[11px] text-slate-500 font-medium block">{t('variance')}</span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                {stats.variance}
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">{t('squaredDispersion')}</span>
            </div>

            <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded">
              <span className="text-[11px] text-slate-500 font-medium block">{t('sharpeRatio')}</span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                {stats.sharpeRatio}
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">{t('riskAdjustedReward')}</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-y border-slate-100 py-2.5 font-mono">
            <div className="flex items-center gap-4 text-slate-600">
              <div>
                <span className="text-slate-400 font-sans">{t('minReturn')} </span>
                <span className="font-semibold text-rose-600">{stats.minReturn}%</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">{t('maxReturn')} </span>
                <span className="font-semibold text-emerald-600">+{stats.maxReturn}%</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans">{t('medianLabel')} </span>
                <span className="font-semibold text-slate-800">{stats.median}%</span>
              </div>
            </div>

            <span className={`px-2 py-0.5 rounded text-[11px] font-sans font-medium border ${riskBadge.color}`}>
              {riskBadge.label}
            </span>
          </div>

          {/* Histogram Chart */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 tracking-tight">
                {t('distributionTitle')}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Normal distribution overlay
              </span>
            </div>

            {stats.count === 0 ? (
              <div className="h-56 flex items-center justify-center text-slate-400 text-xs">
                {t('noDataDistribution')}
              </div>
            ) : (
              <div className="h-60 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={stats.distributionBins}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="range"
                      tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                      axisLine={{ stroke: '#E2E8F0' }}
                      tickLine={false}
                      dy={5}
                    />
                    <YAxis
                      width={35}
                      tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <RechartsTooltip
                      formatter={(val: any, name: string) => [
                        val,
                        name === 'count' ? t('occurrencesLabel') : t('densityLabel'),
                      ]}
                      labelFormatter={(label) => `Interval: ${label}`}
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
                    <Bar
                      dataKey="count"
                      fill="#0F172A"
                      radius={[2, 2, 0, 0]}
                      name="count"
                      maxBarSize={40}
                    />
                    <Line
                      type="monotone"
                      dataKey="normalDensity"
                      stroke="#059669"
                      strokeWidth={2}
                      dot={false}
                      name="normalDensity"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
