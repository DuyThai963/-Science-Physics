// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 4/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React from 'react';
import { useApp } from '../context/AppContext';
import MovieGrid from './MovieGrid';
import { Bookmark, History, Trash2, ArrowLeft } from 'lucide-react';

export default function LibraryView() {
  const {
    favorites,
    history,
    clearHistory,
    libraryTab,
    setLibraryTab,
    goHome,
  } = useApp();

  const isFavorites = libraryTab === 'favorites';
  const movies = isFavorites ? favorites : history;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={goHome}
            className="p-2 rounded-lg bg-surface hover:bg-surface-elevated text-zinc-300 hover:text-white border border-border-subtle cursor-pointer transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Kho Lưu Trữ Cá Nhân
            </h1>
            <p className="text-xs text-foreground-muted font-mono">
              Quản lý danh sách tài liệu đã đánh dấu và lịch sử quan sát
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-surface border border-border-subtle flex items-center">
            <button
              onClick={() => setLibraryTab('favorites')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-200 cursor-pointer ${
                isFavorites
                  ? 'bg-white text-black font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Đã lưu ({favorites.length})</span>
            </button>

            <button
              onClick={() => setLibraryTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-200 cursor-pointer ${
                !isFavorites
                  ? 'bg-white text-black font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Lịch sử ({history.length})</span>
            </button>
          </div>

          {!isFavorites && history.length > 0 && (
            <button
              onClick={clearHistory}
              className="p-2 rounded-lg bg-surface hover:bg-zinc-800 text-zinc-400 hover:text-white border border-border-subtle text-xs font-mono cursor-pointer transition-colors flex items-center gap-1.5"
              title="Xóa toàn bộ lịch sử"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Xóa lịch sử</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <MovieGrid
        movies={movies}
        loading={false}
        totalPages={1}
        page={1}
        emptyMessage={
          isFavorites
            ? 'Bạn chưa lưu mục nào vào danh sách'
            : 'Chưa có lịch sử quan sát gần đây'
        }
      />
    </div>
  );
}
