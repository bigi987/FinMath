import React from 'react';
import { Tooltip } from './Tooltip';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  tooltip?: string;
  minLabel?: string;
  maxLabel?: string;
  prefix?: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  tooltip,
  minLabel,
  maxLabel,
  prefix,
}) => {
  const effectiveMax = Math.max(max, value);
  const percentage = Math.min(100, Math.max(0, ((value - min) / (effectiveMax - min)) * 100));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onChange(0);
      return;
    }
    const parsed = parseFloat(rawVal);
    if (!isNaN(parsed)) {
      onChange(Math.max(0, parsed));
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center">
          {label}
          {tooltip && <Tooltip content={tooltip} />}
        </label>

        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-2.5 text-xs font-medium text-slate-400 select-none pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            type="number"
            value={value === 0 ? '0' : value}
            onChange={handleInputChange}
            step={step}
            min={min}
            className={`w-32 text-right py-1.5 text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-md shadow-subtle focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors font-mono ${
              prefix ? 'pl-6' : 'pl-2.5'
            } pr-9`}
          />
          <span className="absolute right-2.5 text-xs font-medium text-slate-400 select-none pointer-events-none">
            {unit}
          </span>
        </div>
      </div>

      <div className="pt-1">
        <input
          type="range"
          min={min}
          max={effectiveMax}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            background: `linear-gradient(to right, #0F172A 0%, #0F172A ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`,
          }}
          className="w-full h-1.5 rounded appearance-none focus:outline-none"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1 select-none">
          <span>{minLabel || `${min.toLocaleString()}`}</span>
          <span>{maxLabel || `${effectiveMax.toLocaleString()}`}</span>
        </div>
      </div>
    </div>
  );
};
