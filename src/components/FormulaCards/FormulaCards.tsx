import React, { useState } from 'react';
import { MathView } from '../common/MathView';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export const FormulaCards: React.FC = () => {
  const { t } = useTranslation();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const formulasData = [
    {
      id: 'compound-interest',
      number: '1',
      title: t('formula1Title'),
      formula: 'A = P\\left(1 + \\frac{r}{n}\\right)^{nt}',
      description: t('formula1Desc'),
      legend: t('formula1Legend'),
      exampleNumbers: {
        inputs: 'P = $1,000, r = 8% (0.08), n = 12 (monthly), t = 5 years',
        calculation: 'A = 1000 \\times \\left(1 + \\frac{0.08}{12}\\right)^{12 \\times 5} = 1000 \\times (1.00667)^{60}',
        result: 'A = $1,489.85 (Compound Interest: $489.85)',
      },
      practicalUse: t('formula1App'),
    },
    {
      id: 'annuities',
      number: '2',
      title: t('formula2Title'),
      formula: 'FV = PMT \\times \\left[ \\frac{(1 + i)^N - 1}{i} \\right]',
      description: t('formula2Desc'),
      legend: t('formula2Legend'),
      exampleNumbers: {
        inputs: 'PMT = $100/mo, i = 0.08/12 = 0.00667, N = 120 (10 years)',
        calculation: 'FV = 100 \\times \\left[ \\frac{(1 + 0.00667)^{120} - 1}{0.00667} \\right] = 100 \\times \\frac{1.2196}{0.00667}',
        result: 'FV = $18,294.60 (Deposited: $12,000, Interest: $6,294.60)',
      },
      practicalUse: t('formula2App'),
    },
    {
      id: 'mean-variance',
      number: '3',
      title: t('formula3Title'),
      formula: '\\mu = \\frac{\\sum x_i}{N} \\quad \\sigma = \\sqrt{\\frac{\\sum (x_i - \\mu)^2}{N}}',
      description: t('formula3Desc'),
      legend: t('formula3Legend'),
      exampleNumbers: {
        inputs: 'Returns: +10%, +20%, -10%, +20% (N = 4)',
        calculation: '\\mu = \\frac{10 + 20 - 10 + 20}{4} = 10% \\\\ \\sigma = \\sqrt{\\frac{(0)^2 + (10)^2 + (-20)^2 + (10)^2}{4}} = \\sqrt{\\frac{600}{4}} = \\sqrt{150}',
        result: '\\mu = 10.0%, \\sigma = 12.25% (Standard Deviation)',
      },
      practicalUse: t('formula3App'),
    },
  ];

  return (
    <section id="formulas" className="pt-6 pb-12">
      <div className="space-y-4">
        {/* Section Header */}
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {t('formulasSectionTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analytical specifications, equation parameters, and mathematical proofs behind the simulators.
          </p>
        </div>

        {/* 3 Publication-grade Formula Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formulasData.map((item) => {
            const isExpanded = expandedCard === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-lg shadow-subtle p-5 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Title & Number */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      {item.number}
                    </span>
                  </div>

                  {/* Math Formula KaTeX Render */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded p-4 flex items-center justify-center min-h-[72px] overflow-x-auto text-base">
                    <MathView math={item.formula} block />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[32px]">{item.description}</p>

                  {/* Legend */}
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[11px] text-slate-500 leading-normal font-mono">
                      {item.legend}
                    </p>
                  </div>
                </div>

                {/* Expandable Calculation Walkthrough */}
                <div className="pt-3 mt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="w-full flex items-center justify-between text-xs font-medium text-slate-700 hover:text-slate-900 py-1 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isExpanded ? t('hideCalculation') : t('viewWalkthrough')}</span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2 text-slate-700 font-mono animate-fade-in">
                      <div>
                        <span className="font-sans font-semibold text-slate-900 block text-[11px] mb-0.5">
                          {t('exampleInputs')}
                        </span>
                        <p className="text-slate-600 text-[11px]">{item.exampleNumbers.inputs}</p>
                      </div>

                      <div>
                        <span className="font-sans font-semibold text-slate-900 block text-[11px] mb-0.5">
                          {t('formulaEvaluation')}
                        </span>
                        <div className="bg-white p-2 rounded border border-slate-200 overflow-x-auto">
                          <MathView math={item.exampleNumbers.calculation} block />
                        </div>
                      </div>

                      <div className="font-semibold text-emerald-800 bg-emerald-50/80 p-2 rounded border border-emerald-200/80 text-[11px]">
                        {item.exampleNumbers.result}
                      </div>

                      <div className="pt-1">
                        <span className="font-sans font-semibold text-slate-800 block text-[11px]">
                          {t('realWorldApp')}
                        </span>
                        <p className="font-sans text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                          {item.practicalUse}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
