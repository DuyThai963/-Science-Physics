// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 3/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Search, Layers, Check } from 'lucide-react';

export default function CategoryModal({ genres = [] }) {
  const {
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    currentFilter,
    applyFilter,
  } = useApp();

  const [search, setSearch] = useState('');

  if (!isCategoryModalOpen) return null;

  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleSelectGenre = (slug, name) => {
    applyFilter({
      type: 'genre',
      value: slug,
      label: name,
    });
  };

  const handleSelectAll = () => {
    applyFilter({
      type: 'latest',
      value: '',
      label: 'Tất cả',
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsCategoryModalOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl max-h-[80vh] flex flex-col bg-[#0c0c10] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#121216]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <Layers className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Danh Sách Tất Cả Chủ Đề
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Chọn chủ đề để lọc nhanh toàn bộ kho tư liệu
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCategoryModalOpen(false)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search inside categories */}
        <div className="p-4 border-b border-zinc-800/80 bg-[#101014]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm nhanh tên chủ đề..."
              autoFocus
              className="w-full bg-zinc-900 text-white placeholder-zinc-500 text-xs pl-8 pr-3 py-2 rounded-lg border border-zinc-800 focus:border-white focus:outline-none"
            />
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Grid of categories */}
        <div className="p-5 overflow-y-auto space-y-2 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* All option */}
            <button
              onClick={handleSelectAll}
              className={`p-2.5 rounded-lg text-left transition-all cursor-pointer flex items-center justify-between border ${
                currentFilter.type === 'latest'
                  ? 'bg-white text-black font-semibold border-white'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
              }`}
            >
              <span>Tất cả</span>
              {currentFilter.type === 'latest' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            {filteredGenres.map((g) => {
              const isSelected = currentFilter.type === 'genre' && currentFilter.value === (g.slug || g.code);
              return (
                <button
                  key={g.slug || g.code}
                  onClick={() => handleSelectGenre(g.slug || g.code, g.name)}
                  className={`p-2.5 rounded-lg text-left transition-all cursor-pointer flex items-center justify-between border ${
                    isSelected
                      ? 'bg-white text-black font-semibold border-white'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
                  }`}
                >
                  <span className="truncate">{g.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                </button>
              );
            })}
          </div>

          {filteredGenres.length === 0 && (
            <div className="py-8 text-center text-zinc-500 font-mono text-xs">
              Không tìm thấy chủ đề nào khớp với từ khóa "{search}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

