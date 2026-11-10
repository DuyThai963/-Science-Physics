// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 4/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React from 'react';
import { Atom, Database, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-surface/40 border-t border-border-subtle mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white text-black flex items-center justify-center text-xs font-bold">
              <Atom className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">
              Science <span className="text-zinc-500 font-normal">-</span> Physics
            </span>
            <span className="text-xs text-zinc-500 font-mono">| Empirical Archive Lab</span>
          </div>
          <p className="text-xs text-zinc-500 max-w-lg font-mono">
            Nền tảng tích hợp dữ liệu phân tán hai nguồn phục vụ mục đích lưu trữ và quan sát tư liệu.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-border-subtle">
            <Database className="w-3.5 h-3.5 text-zinc-300" />
            <span>Dual Data Stream</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-border-subtle">
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Zero-Latency Switch</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
