// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 4/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { fetchGenres } from '../services/api';
import CategoryModal from './CategoryModal';
import { SlidersHorizontal, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export default function GenreFilter() {
  const {
    source,
    currentFilter,
    applyFilter,
    setIsCategoryModalOpen,
  } = useApp();

  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Drag-to-scroll support for desktop
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetchGenres(source);
        if (mounted) {
          setGenres(res.genres || []);
        }
      } catch (err) {
        console.error('Lỗi tải danh mục:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [source]);

  const handleSelectGenre = (slug, name) => {
    if (currentFilter.type === 'genre' && currentFilter.value === slug) {
      applyFilter({ type: 'latest', value: '', label: '' });
    } else {
      applyFilter({ type: 'genre', value: slug, label: name });
    }
  };

  const handleSelectAll = () => {
    applyFilter({ type: 'latest', value: '', label: '' });
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Convert mouse wheel into horizontal scroll
  const handleWheel = (e) => {
    if (scrollRef.current && e.deltaY !== 0) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    isDownRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDownRef.current = false;
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDownRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  // Featured pills (top 8 genres)
  const displayedGenres = genres.slice(0, 8);

  return (
    <div className="w-full py-2.5">
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Open All Categories Modal Button */}
        <button
          type="button"
          onClick={() => setIsCategoryModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-elevated text-white border border-border-strong text-xs font-mono font-semibold shrink-0 cursor-pointer transition-colors shadow-sm"
          title="Bấm để mở bảng chọn tất cả chủ đề"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
          <span className="text-xs">Chủ đề</span>
          <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
            {genres.length > 0 ? genres.length : '...'}
          </span>
        </button>

        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={() => scroll('left')}
          className="hidden sm:flex p-1.5 rounded-lg bg-surface hover:bg-surface-elevated text-zinc-400 hover:text-white border border-border-subtle shrink-0 cursor-pointer"
          title="Cuộn sang trái"
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Horizontal Pills Container */}
        <div
          ref={scrollRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex items-center gap-2 overflow-x-auto hide-scrollbar scroll-smooth py-0.5 text-xs flex-grow cursor-grab active:cursor-grabbing select-none"
        >
          {/* All Pill */}
          <button
            type="button"
            onClick={handleSelectAll}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg font-mono text-xs transition-all duration-200 cursor-pointer ${
              currentFilter.type === 'latest'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'bg-surface hover:bg-surface-elevated text-zinc-400 hover:text-white border border-border-subtle'
            }`}
          >
            Tất cả
          </button>

          {/* Top 8 Genre Pills */}
          {displayedGenres.map((g) => {
            const isSelected =
              currentFilter.type === 'genre' && currentFilter.value === (g.slug || g.code);
            return (
              <button
                key={g.slug || g.code}
                type="button"
                onClick={() => handleSelectGenre(g.slug || g.code, g.name)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 font-medium whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-surface hover:bg-surface-elevated text-zinc-400 hover:text-white border border-border-subtle'
                }`}
              >
                <span>{g.name}</span>
                {g.count ? (
                  <span className="text-[10px] font-mono opacity-60">({g.count})</span>
                ) : null}
              </button>
            );
          })}

          {/* "+ Xem thêm" pill to trigger category modal */}
          {genres.length > 8 && (
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white bg-surface hover:bg-surface-elevated border border-dashed border-zinc-700 cursor-pointer transition-colors flex items-center gap-1"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
              <span>Xem thêm +</span>
            </button>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-zinc-500 shrink-0 text-xs px-2 font-mono">
              <span className="animate-pulse">Đang nạp...</span>
            </div>
          )}
        </div>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={() => scroll('right')}
          className="hidden sm:flex p-1.5 rounded-lg bg-surface hover:bg-surface-elevated text-zinc-400 hover:text-white border border-border-subtle shrink-0 cursor-pointer"
          title="Cuộn sang phải"
          aria-label="Cuộn sang phải"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Modal Popup */}
      <CategoryModal genres={genres} />
    </div>
  );
}
