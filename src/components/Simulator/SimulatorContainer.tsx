import React from 'react';
import {
  TrendingUp,
  Landmark,
  ShieldAlert,
} from 'lucide-react';
import { CompoundSavingsInput, Currency, LoanInput, SimulatorTab } from '../../types';
import { CompoundSavings } from './CompoundSavings';
import { LoanCalculator } from './LoanCalculator';
import { RiskStatistics } from './RiskStatistics';
import { useTranslation } from '../../context/LanguageContext';

interface SimulatorContainerProps {
  activeTab: SimulatorTab;
  onTabChange: (tab: SimulatorTab) => void;
  currency: Currency;
  savingsInput: CompoundSavingsInput;
  onSavingsChange: (val: CompoundSavingsInput) => void;
  loanInput: LoanInput;
  onLoanChange: (val: LoanInput) => void;
  activeScenarioId?: 'A' | 'B';
  onScenarioToggle?: (id: 'A' | 'B') => void;
}

export const SimulatorContainer: React.FC<SimulatorContainerProps> = ({
  activeTab,
  onTabChange,
  currency,
  savingsInput,
  onSavingsChange,
  loanInput,
  onLoanChange,
  activeScenarioId,
  onScenarioToggle,
}) => {
  const { t } = useTranslation();

  const tabs = [
    {
      id: 'compound' as SimulatorTab,
      label: t('tabCompound'),
      icon: TrendingUp,
    },
    {
      id: 'loan' as SimulatorTab,
      label: t('tabLoan'),
      icon: Landmark,
    },
    {
      id: 'risk' as SimulatorTab,
      label: t('tabRisk'),
      icon: ShieldAlert,
    },
  ];

  return (
    <section id="simulators" className="pt-2 pb-12">
      <div className="space-y-4">
        {/* Simulators Navigation Segment Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t('simulatorsTitle')}
            </h2>
          </div>

          <div className="flex items-center p-0.5 bg-slate-100 rounded-md border border-slate-200 text-xs font-medium w-full sm:w-fit overflow-x-auto no-scrollbar">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onTabChange(id)}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-slate-900 font-semibold shadow-subtle'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Active Content */}
        <div className="animate-fade-in">
          {activeTab === 'compound' && (
            <CompoundSavings
              currency={currency}
              input={savingsInput}
              onChange={onSavingsChange}
              activeScenarioId={activeScenarioId}
              onScenarioToggle={onScenarioToggle}
            />
          )}

          {activeTab === 'loan' && (
            <LoanCalculator
              currency={currency}
              input={loanInput}
              onChange={onLoanChange}
            />
          )}

          {activeTab === 'risk' && <RiskStatistics />}
        </div>
      </div>
    </section>
  );
};
