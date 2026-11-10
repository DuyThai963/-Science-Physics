// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 4/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React from 'react';
import { useApp } from '../context/AppContext';
import { Check } from 'lucide-react';

export default function SourceSwitcher() {
  const { source, setSource } = useApp();

  return (
    <div
      className="inline-flex items-center p-0.5 sm:p-1 bg-surface border border-border-subtle rounded-xl backdrop-blur-md"
      role="radiogroup"
      aria-label="Chọn nguồn dữ liệu tư liệu"
    >
      <button
        type="button"
        role="radio"
        aria-checked={source === 'vsphim'}
        onClick={() => setSource('vsphim')}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-mono font-medium tracking-wider transition-all duration-200 cursor-pointer ${
          source === 'vsphim'
            ? 'bg-white text-black shadow-sm font-semibold'
            : 'text-foreground-secondary hover:text-white hover:bg-surface-elevated'
        }`}
      >
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            source === 'vsphim' ? 'bg-black' : 'bg-zinc-500'
          }`}
        />
        <span>VSPHIM</span>
        {source === 'vsphim' && <Check className="w-3 sm:w-3.5 h-3 sm:h-3.5 stroke-[2.5]" />}
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={source === 'topxx'}
        onClick={() => setSource('topxx')}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-mono font-medium tracking-wider transition-all duration-200 cursor-pointer ${
          source === 'topxx'
            ? 'bg-white text-black shadow-sm font-semibold'
            : 'text-foreground-secondary hover:text-white hover:bg-surface-elevated'
        }`}
      >
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            source === 'topxx' ? 'bg-black' : 'bg-zinc-500'
          }`}
        />
        <span>TOPXX</span>
        {source === 'topxx' && <Check className="w-3 sm:w-3.5 h-3 sm:h-3.5 stroke-[2.5]" />}
      </button>
    </div>
  );
}
