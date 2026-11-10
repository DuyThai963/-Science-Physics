// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 4/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight, FileSearch, RefreshCw } from 'lucide-react';

export default function MovieGrid({
  movies = [],
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  emptyMessage = 'Không tìm thấy tư liệu nào',
  onRetry,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-surface border border-border-subtle rounded-xl overflow-hidden animate-pulse"
          >
            <div className="aspect-[3/4] w-full bg-surface-elevated" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-surface-elevated rounded w-5/6" />
              <div className="h-3 bg-surface-elevated rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="py-16 px-4 text-center flex flex-col items-center justify-center bg-surface border border-border-subtle rounded-2xl">
        <div className="w-14 h-14 rounded-xl bg-surface-elevated border border-border-subtle flex items-center justify-center text-foreground-muted mb-4">
          <FileSearch className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
          {emptyMessage}
        </h3>
        <p className="text-xs sm:text-sm text-foreground-muted max-w-md mb-6">
          Vui lòng thử từ khóa khác, thay đổi chủ đề hoặc chuyển đổi giữa nguồn VSPHIM và TOPXX ở thanh điều hướng.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-semibold rounded-lg cursor-pointer transition-all duration-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tải lại dữ liệu</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {movies.map((movie) => (
          <MovieCard key={`${movie.source}-${movie.id}`} movie={movie} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-3 pt-4 pb-8"
          aria-label="Phân trang danh sách tư liệu"
        >
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border bg-surface hover:bg-surface-elevated text-zinc-300 hover:text-white border-border-subtle disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trang trước</span>
          </button>

          <div className="flex items-center px-4 py-2 rounded-lg bg-surface-elevated border border-border-subtle text-xs font-mono text-foreground-secondary">
            <span>Trang </span>
            <span className="text-white font-bold mx-1.5">{page}</span>
            <span> / {totalPages}</span>
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border bg-surface hover:bg-surface-elevated text-zinc-300 hover:text-white border-border-subtle disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
          >
            <span>Trang sau</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
