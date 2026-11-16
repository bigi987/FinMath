import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center ml-1"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children || (
        <button
          type="button"
          tabIndex={-1}
          className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-help p-0.5"
          aria-label="More information"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      )}

      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 p-2 text-xs leading-relaxed text-slate-100 bg-slate-900 border border-slate-800 rounded-md shadow-xl pointer-events-none transition-opacity duration-100 animate-fade-in text-center font-normal">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
