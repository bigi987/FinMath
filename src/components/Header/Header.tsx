import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  GitCompare,
  BookOpen,
  RotateCcw,
  ChevronDown,
  Check,
  Menu,
  X,
  Globe,
} from 'lucide-react';
import { Currency } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';

interface HeaderProps {
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onReset: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isLiveRates?: boolean;
}

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  shortLabel: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'ro', name: 'Română', flag: '🇲🇩', shortLabel: 'RO' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', shortLabel: 'RU' },
  { code: 'en', name: 'English', flag: '🇬🇧', shortLabel: 'EN' },
];

const CURRENCIES: Currency[] = ['MDL', 'USD', 'EUR'];

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onCurrencyChange,
  onReset,
  activeSection,
  onNavigate,
  isLiveRates = false,
}) => {
  const { t, language, setLanguage } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'simulators', label: t('navSimulators'), icon: TrendingUp },
    { id: 'compare', label: t('navCompare'), icon: GitCompare },
    { id: 'formulas', label: t('navFormulas'), icon: BookOpen },
  ];

  const currentLangObj =
    LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded"
            aria-label="FinMath Home"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-900 text-white shadow-subtle">
              <span className="font-mono text-xs font-bold tracking-tighter">∑f</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold tracking-tight text-slate-900 font-sans">
                Fin<span className="text-slate-500 font-normal">Math</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {navItems.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Controls: Currency, Language, Reset */}
          <div className="hidden md:flex items-center gap-2">
            {/* Currency Selector */}
            <div
              aria-label="Currency"
              title={isLiveRates ? 'Live FX exchange rates active' : 'Standard reference FX rates'}
              className="flex items-center p-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-xs font-medium"
            >
              {CURRENCIES.map((code) => {
                const isActive = currentCurrency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onCurrencyChange(code)}
                    aria-pressed={isActive}
                    className={`px-2 py-1 rounded text-xs transition-colors font-mono ${
                      isActive
                        ? 'bg-white text-slate-900 font-semibold shadow-subtle'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {code}
                  </button>
                );
              })}
            </div>

            {/* Language Picker */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-expanded={langDropdownOpen}
                aria-haspopup="listbox"
                className="flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                <span className="text-xs">{currentLangObj.flag}</span>
                <span className="font-mono text-xs">{currentLangObj.shortLabel}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 mt-1 w-36 rounded-md bg-white border border-slate-200 shadow-dropdown p-1 z-50 animate-fade-in"
                >
                  <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>Language</span>
                    <Globe className="w-3 h-3" />
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {LANGUAGE_OPTIONS.map((opt) => {
                      const isSelected = language === opt.code;
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setLanguage(opt.code);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
                            isSelected
                              ? 'bg-slate-100 text-slate-900 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{opt.flag}</span>
                            <span>{opt.name}</span>
                          </div>
                          {isSelected && <Check className="w-3 h-3 text-slate-900" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Reset Defaults */}
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              title="Reset all inputs to defaults"
            >
              <RotateCcw className="h-3 w-3 text-slate-400" />
              <span>{t('resetBtn')}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextIdx = (CURRENCIES.indexOf(currentCurrency) + 1) % CURRENCIES.length;
                onCurrencyChange(CURRENCIES[nextIdx]);
              }}
              className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-mono font-semibold text-slate-800"
            >
              {currentCurrency}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-3 animate-fade-in shadow-lg">
          <div className="space-y-1">
            {navItems.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Currency:</span>
            <div className="flex gap-1">
              {CURRENCIES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onCurrencyChange(code)}
                  className={`px-2 py-1 rounded text-xs font-mono ${
                    currentCurrency === code
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Language:</span>
            <div className="flex gap-1">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLanguage(opt.code)}
                  className={`px-2 py-1 rounded text-xs ${
                    language === opt.code
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {opt.flag} {opt.shortLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onReset();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('resetBtn')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
