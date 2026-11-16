import React, { useState } from 'react';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { SimulatorContainer } from './components/Simulator/SimulatorContainer';
import { CompareSection } from './components/Compare/CompareSection';
import { FormulaCards } from './components/FormulaCards/FormulaCards';
import { Footer } from './components/Footer/Footer';
import { useCurrency } from './hooks/useCurrency';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTranslation } from './context/LanguageContext';
import { CompoundSavingsInput, Currency, LoanInput, SimulatorTab } from './types';
import { CheckCircle2 } from 'lucide-react';

const DEFAULT_SCENARIO_A: CompoundSavingsInput = {
  initialDeposit: 555.56,
  monthlyContribution: 83.33,
  annualRate: 8.5,
  periodYears: 10,
  compoundingFrequency: 'monthly',
};

const DEFAULT_SCENARIO_B: CompoundSavingsInput = {
  initialDeposit: 1000.0,
  monthlyContribution: 150.0,
  annualRate: 9.0,
  periodYears: 10,
  compoundingFrequency: 'monthly',
};

const DEFAULT_LOAN_INPUT: LoanInput = {
  loanAmount: 150000,
  annualRate: 6.5,
  durationYears: 30,
  paymentFrequency: 'monthly',
};

export const App: React.FC = () => {
  const { currency, setCurrency, convert, isLive } = useCurrency();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useLocalStorage<SimulatorTab>(
    'finmath_active_tab',
    'compound'
  );
  const [activeScenarioId, setActiveScenarioId] = useState<'A' | 'B'>('A');
  const [activeSection, setActiveSection] = useState<string>('simulators');

  const [scenarioA, setScenarioA] = useLocalStorage<CompoundSavingsInput>(
    'finmath_scenario_a',
    DEFAULT_SCENARIO_A
  );

  const [scenarioB, setScenarioB] = useLocalStorage<CompoundSavingsInput>(
    'finmath_scenario_b',
    DEFAULT_SCENARIO_B
  );

  const [loanInput, setLoanInput] = useLocalStorage<LoanInput>(
    'finmath_loan',
    DEFAULT_LOAN_INPUT
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Dynamic Scrollspy to track active section in navigation
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      const formulasEl = document.getElementById('formulas');
      const compareEl = document.getElementById('compare');
      const simulatorsEl = document.getElementById('simulators');

      if (formulasEl && formulasEl.offsetTop <= scrollPosition) {
        setActiveSection('formulas');
      } else if (compareEl && compareEl.offsetTop <= scrollPosition) {
        setActiveSection('compare');
      } else if (simulatorsEl && simulatorsEl.offsetTop <= scrollPosition) {
        setActiveSection('simulators');
      } else {
        setActiveSection('simulators');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Convert inputs when currency changes
  const handleCurrencyChange = (newCurrency: Currency) => {
    if (newCurrency === currency) return;

    const conv = (amount: number) => convert(amount, currency, newCurrency);

    setScenarioA((prev) => ({
      ...prev,
      initialDeposit: conv(prev.initialDeposit),
      monthlyContribution: conv(prev.monthlyContribution),
    }));

    setScenarioB((prev) => ({
      ...prev,
      initialDeposit: conv(prev.initialDeposit),
      monthlyContribution: conv(prev.monthlyContribution),
    }));

    setLoanInput((prev) => ({
      ...prev,
      loanAmount: conv(prev.loanAmount),
    }));

    setCurrency(newCurrency);
    showToast(`${t('currencyToast')} ${newCurrency}`);
  };

  // Reset to initial reference defaults — currency is preserved
  const handleReset = () => {
    setScenarioA(DEFAULT_SCENARIO_A);
    setScenarioB(DEFAULT_SCENARIO_B);
    setLoanInput(DEFAULT_LOAN_INPUT);
    setActiveScenarioId('A');
    showToast(t('resetToast'));
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      const navOffset = 64;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Active scenario input
  const currentSavingsInput = activeScenarioId === 'A' ? scenarioA : scenarioB;
  const setCurrentSavingsInput = (val: CompoundSavingsInput) => {
    if (activeScenarioId === 'A') {
      setScenarioA(val);
    } else {
      setScenarioB(val);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-3.5 py-2 rounded-md shadow-xl text-xs font-mono font-medium animate-fade-in border border-slate-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentCurrency={currency}
        onCurrencyChange={handleCurrencyChange}
        onReset={handleReset}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isLiveRates={isLive}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Hero
          onStartSimulating={() => handleNavigate('simulators')}
          onExploreFormulas={() => handleNavigate('formulas')}
        />

        <SimulatorContainer
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currency={currency}
          savingsInput={currentSavingsInput}
          onSavingsChange={setCurrentSavingsInput}
          loanInput={loanInput}
          onLoanChange={setLoanInput}
          activeScenarioId={activeScenarioId}
          onScenarioToggle={setActiveScenarioId}
        />

        <CompareSection
          currency={currency}
          scenarioA={scenarioA}
          scenarioB={scenarioB}
          onChangeA={setScenarioA}
          onChangeB={setScenarioB}
        />

        <FormulaCards />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
