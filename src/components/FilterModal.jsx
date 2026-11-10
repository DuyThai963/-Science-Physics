// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 3/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchGenres, fetchCountries, fetchYears } from '../services/api';
import { X, Filter, RotateCcw, Check, Sparkles, Globe, Calendar, Layers } from 'lucide-react';

export default function FilterModal() {
  const {
    source,
    isFilterModalOpen,
    setIsFilterModalOpen,
    currentFilter,
    applyFilter,
    resetFilters,
  } = useApp();

  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);

  // Local draft selection inside modal
  const [selectedType, setSelectedType] = useState(currentFilter.type || 'latest');
  const [selectedValue, setSelectedValue] = useState(currentFilter.value || '');
  const [selectedLabel, setSelectedLabel] = useState(currentFilter.label || '');

  useEffect(() => {
    if (!isFilterModalOpen) return;
    setSelectedType(currentFilter.type || 'latest');
    setSelectedValue(currentFilter.value || '');
    setSelectedLabel(currentFilter.label || '');

    let mounted = true;
    async function loadMeta() {
      setLoading(true);
      try {
        const [gRes, cRes, yRes] = await Promise.all([
          fetchGenres(source),
          fetchCountries(source),
          source === 'vsphim' ? fetchYears() : Promise.resolve({ years: [] }),
        ]);
        if (mounted) {
          setGenres(gRes.genres || []);
          setCountries(cRes.countries || []);
          setYears(yRes.years || []);
        }
      } catch (err) {
        console.error('Lỗi nạp metadata bộ lọc:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadMeta();
    return () => {
      mounted = false;
    };
  }, [isFilterModalOpen, source, currentFilter]);

  if (!isFilterModalOpen) return null;

  const handleSelect = (type, value, label) => {
    setSelectedType(type);
    setSelectedValue(value);
    setSelectedLabel(label);
  };

  const handleApply = () => {
    applyFilter({
      type: selectedType,
      value: selectedValue,
      label: selectedLabel,
    });
  };

  const handleReset = () => {
    setSelectedType('latest');
    setSelectedValue('');
    setSelectedLabel('');
    resetFilters();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsFilterModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#0c0c10] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#121216]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <Filter className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 id="filter-modal-title" className="text-sm sm:text-base font-bold text-white tracking-tight">
                Bộ Lọc Dữ Liệu Nâng Cao
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Thích ứng theo máy chủ: <strong className="text-white uppercase">{source}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition-colors"
            aria-label="Đóng bộ lọc"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Filter Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Quick Preset: Latest / Today */}
          <div>
            <div className="flex items-center gap-1.5 font-mono text-zinc-400 uppercase tracking-wider mb-2.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Phân loại cơ bản</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSelect('latest', '', 'Mới cập nhật')}
                className={`px-3 py-1.5 rounded-lg font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedType === 'latest'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <span>Mới cập nhật</span>
                {selectedType === 'latest' && <Check className="w-3 h-3 stroke-[3]" />}
              </button>

              {source === 'topxx' && (
                <button
                  type="button"
                  onClick={() => handleSelect('today', '', 'Phát hành hôm nay')}
                  className={`px-3 py-1.5 rounded-lg font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedType === 'today'
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  <span>Phát hành hôm nay (/movies/today)</span>
                  {selectedType === 'today' && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              )}
            </div>
          </div>

          {/* Section: Countries */}
          <div>
            <div className="flex items-center gap-1.5 font-mono text-zinc-400 uppercase tracking-wider mb-2.5 text-[11px]">
              <Globe className="w-3.5 h-3.5 text-white" />
              <span>Quốc gia / Khu vực</span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
              {countries.map((c) => {
                const isSelected = selectedType === 'country' && selectedValue === (c.slug || c.code);
                return (
                  <button
                    key={c.slug || c.code}
                    type="button"
                    onClick={() => handleSelect('country', c.slug || c.code, c.name)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <span>{c.name}</span>
                    {c.count ? <span className="text-[10px] opacity-60">({c.count})</span> : null}
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Genres */}
          <div>
            <div className="flex items-center gap-1.5 font-mono text-zinc-400 uppercase tracking-wider mb-2.5 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-white" />
              <span>Chủ đề / Thể loại</span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
              {genres.map((g) => {
                const isSelected = selectedType === 'genre' && selectedValue === (g.slug || g.code);
                return (
                  <button
                    key={g.slug || g.code}
                    type="button"
                    onClick={() => handleSelect('genre', g.slug || g.code, g.name)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <span>{g.name}</span>
                    {g.count ? <span className="text-[10px] opacity-60">({g.count})</span> : null}
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Years (for VSPhim) */}
          {source === 'vsphim' && years.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 font-mono text-zinc-400 uppercase tracking-wider mb-2.5 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-white" />
                <span>Năm phát hành</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {years.map((y) => {
                  const isSelected = selectedType === 'year' && selectedValue === y;
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => handleSelect('year', y, y)}
                      className={`px-3 py-1.5 rounded-lg font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-white text-black font-semibold shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      <span>{y}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {loading && (
            <div className="py-4 text-center text-zinc-500 font-mono text-xs animate-pulse">
              Đang tải danh mục cấu hình bộ lọc từ {source.toUpperCase()}...
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-[#121216]">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800 text-xs font-mono cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại tất cả</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(false)}
              className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white text-xs font-mono cursor-pointer transition-colors"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-white text-black font-bold text-xs font-mono cursor-pointer hover:bg-zinc-200 transition-colors shadow-sm"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Áp dụng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

