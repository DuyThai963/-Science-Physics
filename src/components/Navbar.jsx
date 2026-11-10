// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 4/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import SourceSwitcher from './SourceSwitcher';
import { Search, Bookmark, History, Atom, X, Filter } from 'lucide-react';

export default function Navbar() {
  const {
    source,
    searchQuery,
    setSearchQuery,
    favorites,
    history,
    activeView,
    setActiveView,
    setLibraryTab,
    goHome,
    currentFilter,
    setIsFilterModalOpen,
  } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch.trim());
    if (activeView !== 'home') {
      goHome();
    }
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  const openFavorites = () => {
    setLibraryTab('favorites');
    setActiveView('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openHistory = () => {
    setLibraryTab('history');
    setActiveView('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilter = currentFilter.type !== 'latest';

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-canvas/95 backdrop-blur-md border-border-subtle shadow-md shadow-black/50'
          : 'bg-canvas/80 backdrop-blur-sm border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo - Science - Physics */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={goHome}
            className="flex items-center gap-2 sm:gap-3 group text-left cursor-pointer focus:outline-none"
            aria-label="Về trang chủ Science - Physics"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white text-black flex items-center justify-center font-bold transition-transform duration-200 group-hover:scale-105 shrink-0">
              <Atom className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2 leading-none">
                <span className="font-extrabold text-sm sm:text-lg tracking-tight text-white whitespace-nowrap">
                  Science <span className="text-zinc-500 font-light">-</span> Physics
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-semibold bg-surface-elevated text-zinc-300 border border-border-subtle hidden xs:inline">
                  LAB
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-foreground-muted font-mono tracking-wider uppercase mt-0.5 hidden xs:inline">
                Observational Archive
              </span>
            </div>
          </button>
        </div>

        {/* Source Switcher (Center on Desktop) */}
        <div className="hidden md:flex items-center">
          <SourceSwitcher />
        </div>

        {/* Search, Filter & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex relative items-center w-48 md:w-56 lg:w-64"
          >
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={`Tìm trong ${source.toUpperCase()}...`}
              className="w-full bg-surface text-foreground-primary placeholder-foreground-muted text-xs pl-8 pr-7 py-2 rounded-lg border border-border-subtle focus:border-white focus:outline-none transition-all duration-200 font-sans"
            />
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-foreground-muted pointer-events-none" />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 p-0.5 text-foreground-muted hover:text-white cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Advanced Filter Button (beside search) */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer ${
              hasActiveFilter
                ? 'bg-white text-black font-semibold border-white shadow-sm'
                : 'bg-surface hover:bg-surface-elevated text-zinc-300 hover:text-white border-border-subtle'
            }`}
            title="Mở bộ lọc dữ liệu nâng cao"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bộ lọc</span>
            {hasActiveFilter && (
              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
            )}
          </button>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="sm:hidden p-2 text-foreground-secondary hover:text-white rounded-lg bg-surface border border-border-subtle cursor-pointer"
            aria-label="Mở tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bookmarks Button */}
          <button
            onClick={openFavorites}
            className={`relative p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
              activeView === 'library'
                ? 'bg-white text-black border-white'
                : 'bg-surface hover:bg-surface-elevated border-border-subtle text-foreground-secondary hover:text-white'
            }`}
            title="Mục đã lưu"
            aria-label="Mục đã lưu"
          >
            <Bookmark className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center border-2 border-canvas">
                {favorites.length > 99 ? '99+' : favorites.length}
              </span>
            )}
          </button>

          {/* History Button (Desktop) */}
          <button
            onClick={openHistory}
            className="p-2 rounded-lg border bg-surface hover:bg-surface-elevated border-border-subtle text-foreground-secondary hover:text-white transition-all duration-200 cursor-pointer hidden md:flex items-center gap-1.5 text-xs font-medium"
            title="Lịch sử xem tư liệu"
            aria-label="Lịch sử xem"
          >
            <History className="w-4 h-4" />
            <span>Lịch sử</span>
            {history.length > 0 && (
              <span className="text-[10px] text-foreground-muted font-mono">({history.length})</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Bar: Source Switcher (Always visible on mobile!) */}
      <div className="md:hidden px-3 py-2 bg-[#0c0c10] border-t border-zinc-800/80 flex items-center justify-between">
        <span className="text-[11px] font-mono text-zinc-400">Nguồn dữ liệu:</span>
        <SourceSwitcher />
      </div>

      {/* Mobile Search Bar Expansion */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-3 pb-3 pt-2 border-t border-border-subtle bg-canvas">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={`Tìm trong ${source.toUpperCase()}...`}
              autoFocus
              className="w-full bg-surface text-foreground-primary placeholder-foreground-muted text-sm pl-9 pr-8 py-2 rounded-lg border border-border-subtle focus:border-white focus:outline-none font-sans"
            />
            <Search className="absolute left-3 w-4 h-4 text-foreground-muted pointer-events-none" />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 p-1 text-foreground-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      )}
    </header>
  );
}
