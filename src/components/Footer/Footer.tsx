import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface FooterProps {
  rateStatusText?: string;
  isLiveRates?: boolean;
  onNavigate?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const scrollTo = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-3">
            <div
              className="flex items-center gap-2 cursor-pointer w-fit"
              onClick={scrollToTop}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-white">
                <span className="font-mono text-xs font-bold tracking-tighter">∑f</span>
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 font-sans">
                Fin<span className="text-slate-500 font-normal">Math</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              {t('footerDesc')}
            </p>

            <div className="pt-0.5">
              <span className="inline-block text-[11px] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                {t('footerRates')}
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              {t('footerNavTitle')}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('hero')}
                  className="text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {t('footerOverview')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('simulators')}
                  className="text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {t('navSimulators')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('compare')}
                  className="text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {t('navCompare')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('formulas')}
                  className="text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {t('navFormulas')}
                </button>
              </li>
            </ul>
          </div>

          {/* Implemented Models */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              {t('footerFormulasTitle')}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 font-mono">
              <li>{t('formula1Title')}</li>
              <li>{t('formula2Title')}</li>
              <li>{t('formula3Title')}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <p>{t('footerCopyright')}</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-sans text-xs transition-colors cursor-pointer"
          >
            <ArrowUp className="w-3 h-3" />
            <span>{t('backToTop')}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
