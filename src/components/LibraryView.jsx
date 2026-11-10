// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 4/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import MovieGrid from './MovieGrid';
import { Bookmark, History, Trash2, ArrowLeft, Download, Upload } from 'lucide-react';

export default function LibraryView() {
  const {
    favorites,
    history,
    clearHistory,
    libraryTab,
    setLibraryTab,
    goHome,
    showToast,
  } = useApp();

  const fileInputRef = useRef(null);
  const isFavorites = libraryTab === 'favorites';
  const movies = isFavorites ? favorites : history;

  const handleExport = () => {
    try {
      const backupData = {
        favorites,
        history,
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `science-physics-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Đã xuất file sao lưu JSON thành công');
    } catch {
      showToast('Lỗi khi xuất file sao lưu');
    }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data.favorites) || Array.isArray(data.history)) {
          if (Array.isArray(data.favorites)) {
            localStorage.setItem('cineadult_favorites', JSON.stringify(data.favorites));
          }
          if (Array.isArray(data.history)) {
            localStorage.setItem('cineadult_history', JSON.stringify(data.history));
          }
          showToast('Đã khôi phục dữ liệu thành công!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast('File JSON không hợp lệ');
        }
      } catch {
        showToast('Không thể đọc file JSON');
      }
    };
    reader.readAsText(file);
  };

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

        {/* Tab switch and Backup buttons */}
        <div className="flex flex-wrap items-center gap-2">
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

          {/* Export button */}
          <button
            onClick={handleExport}
            className="p-2 rounded-lg bg-surface hover:bg-zinc-800 text-zinc-300 hover:text-white border border-border-subtle text-xs font-mono cursor-pointer transition-colors flex items-center gap-1.5"
            title="Xuất file sao lưu (.json)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sao lưu</span>
          </button>

          {/* Import button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg bg-surface hover:bg-zinc-800 text-zinc-300 hover:text-white border border-border-subtle text-xs font-mono cursor-pointer transition-colors flex items-center gap-1.5"
            title="Nhập file sao lưu (.json)"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Khôi phục</span>
          </button>

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
