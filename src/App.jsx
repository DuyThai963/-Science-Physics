// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 4/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React, { useEffect, useState } from 'react';
import { useApp } from './context/AppContext';
import {
  fetchLatestMovies,
  searchMovies,
  fetchMoviesByGenre,
  fetchMoviesByCountry,
  fetchMoviesByYear,
  fetchMoviesToday,
} from './services/api';
import Navbar from './components/Navbar';
import GenreFilter from './components/GenreFilter';
import FilterModal from './components/FilterModal';
import HeroFeatured from './components/HeroFeatured';
import MovieGrid from './components/MovieGrid';
import WatchView from './components/WatchView';
import LibraryView from './components/LibraryView';
import StealthMode from './components/StealthMode';
import Footer from './components/Footer';
import { Database, Search, SlidersHorizontal, Globe, Calendar, Sparkles, X } from 'lucide-react';

export default function App() {
  const {
    source,
    activeGenre,
    searchQuery,
    currentFilter,
    resetFilters,
    activeView,
    toastMessage,
    stealthMode,
    setStealthMode,
  } = useApp();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  // Reset page to 1 when source, currentFilter, or search changes
  useEffect(() => {
    setPage(1);
  }, [source, currentFilter.type, currentFilter.value, searchQuery]);

  // Load movies
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        let result;
        if (searchQuery.trim()) {
          result = await searchMovies(source, searchQuery.trim(), page);
        } else if (currentFilter.type === 'genre' && currentFilter.value) {
          result = await fetchMoviesByGenre(source, currentFilter.value, page);
        } else if (currentFilter.type === 'country' && currentFilter.value) {
          result = await fetchMoviesByCountry(source, currentFilter.value, page);
        } else if (currentFilter.type === 'year' && currentFilter.value) {
          result = await fetchMoviesByYear(currentFilter.value, page);
        } else if (currentFilter.type === 'today') {
          result = await fetchMoviesToday(page);
        } else {
          result = await fetchLatestMovies(source, page);
        }

        if (isMounted) {
          setMovies(result.items || []);
          setTotalPages(result.totalPages || 1);
        }
      } catch (err) {
        console.error('Lỗi nạp dữ liệu:', err);
        if (isMounted) {
          setError(err.message || 'Không thể kết nối đến máy chủ API');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (activeView === 'home') {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [source, currentFilter, searchQuery, page, activeView]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const isBrowsingAll =
    !searchQuery &&
    currentFilter.type === 'latest' &&
    page === 1 &&
    movies.length > 0;
  const featuredMovie = isBrowsingAll ? movies[0] : null;
  const listMovies = featuredMovie ? movies.slice(1) : movies;

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-foreground-primary">
      <Navbar />

      <main className="flex-grow">
        {activeView === 'watch' ? (
          <WatchView />
        ) : activeView === 'library' ? (
          <LibraryView />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Hero Billboard when browsing home page 1 */}
            {featuredMovie && <HeroFeatured movie={featuredMovie} />}

            {/* Genre Filter Bar */}
            <GenreFilter />

            {/* Section Heading with Active Filter Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 mt-4 border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {searchQuery ? (
                  <>
                    <Search className="w-4 h-4 text-white" />
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                      Kết quả tìm kiếm cho: <span className="font-mono text-zinc-300">"{searchQuery}"</span>
                    </h2>
                  </>
                ) : currentFilter.type === 'genre' && currentFilter.value ? (
                  <>
                    <SlidersHorizontal className="w-4 h-4 text-white" />
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                      Chủ đề: <span className="text-zinc-200 font-mono">{currentFilter.label || currentFilter.value}</span>
                    </h2>
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title="Bỏ lọc chủ đề"
                    >
                      <X className="w-3 h-3" />
                      <span>Xóa lọc</span>
                    </button>
                  </>
                ) : currentFilter.type === 'country' && currentFilter.value ? (
                  <>
                    <Globe className="w-4 h-4 text-white" />
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                      Khu vực: <span className="text-zinc-200 font-mono">{currentFilter.label || currentFilter.value}</span>
                    </h2>
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title="Bỏ lọc khu vực"
                    >
                      <X className="w-3 h-3" />
                      <span>Xóa lọc</span>
                    </button>
                  </>
                ) : currentFilter.type === 'year' && currentFilter.value ? (
                  <>
                    <Calendar className="w-4 h-4 text-white" />
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                      Năm phát hành: <span className="text-zinc-200 font-mono">{currentFilter.label || currentFilter.value}</span>
                    </h2>
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title="Bỏ lọc năm"
                    >
                      <X className="w-3 h-3" />
                      <span>Xóa lọc</span>
                    </button>
                  </>
                ) : currentFilter.type === 'today' ? (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                      Phát hành hôm nay <span className="text-zinc-400 font-mono text-xs">(TOPXX /movies/today)</span>
                    </h2>
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title="Quay lại tất cả"
                    >
                      <X className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 text-white" />
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                      Dữ Liệu Mới Cập Nhật - Nguồn <span className="font-mono uppercase text-zinc-300">{source}</span>
                    </h2>
                  </>
                )}
              </div>

              <span className="text-xs text-foreground-muted font-mono shrink-0">
                Engine: <strong className="text-zinc-300 uppercase">{source}</strong>
              </span>
            </div>

            {/* Movies Grid */}
            <MovieGrid
              movies={listMovies}
              loading={loading}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              emptyMessage={
                searchQuery
                  ? `Không có kết quả nào cho "${searchQuery}" trên nguồn ${source.toUpperCase()}`
                  : `Không có tư liệu nào khớp với bộ lọc hiện tại`
              }
              onRetry={() => setPage(page)}
            />
          </div>
        )}
      </main>

      <Footer />

      {/* Advanced Filter Modal */}
      <FilterModal />

      {/* Stealth Boss Key Overlay */}
      {stealthMode && <StealthMode onClose={() => setStealthMode(false)} />}

      {/* Floating Toast Notification - Monochrome */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-surface border border-zinc-700 text-white text-xs font-mono shadow-2xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
