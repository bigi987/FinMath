import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

interface HeroProps {
  onStartSimulating?: () => void;
  onExploreFormulas?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const { t } = useTranslation();

  return (
    <section id="hero" className="pt-8 pb-4 border-b border-slate-200/80 mb-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
            Quantitative Modeling & Projection
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t('heroTitle1')} {t('heroTitle2')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>
      </div>
    </section>
  );
};
