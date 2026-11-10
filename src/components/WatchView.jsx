// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 4/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchMovieDetail, fetchMoviesByGenre, fetchLatestMovies } from '../services/api';
import MovieCard from './MovieCard';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Server,
  Play,
  Clock,
  Info,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function WatchView() {
  const {
    currentMovie,
    goHome,
    toggleFavorite,
    isFavorite,
    showToast,
    setActiveGenre,
    setSearchQuery,
  } = useApp();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);

  // Video playback state
  const [activeSourceIndex, setActiveSourceIndex] = useState(0);
  const [theaterMode, setTheaterMode] = useState(false);
  const [lightsOff, setLightsOff] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!currentMovie || !currentMovie.id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMovieDetail(currentMovie.source, currentMovie.id);
        if (mounted) {
          setDetail(data);
          setActiveSourceIndex(0);
          document.title = `Tư liệu: ${data.title || currentMovie.title} - Science Physics`;

          // Fetch related
          try {
            const firstGenre = data.genres?.[0]?.slug || data.genres?.[0]?.code;
            let relRes;
            if (firstGenre) {
              relRes = await fetchMoviesByGenre(currentMovie.source, firstGenre, 1);
            } else {
              relRes = await fetchLatestMovies(currentMovie.source, 1);
            }
            if (mounted && relRes?.items) {
              const filtered = relRes.items.filter((m) => m.id !== currentMovie.id).slice(0, 6);
              setRelatedMovies(filtered);
            }
          } catch {
            // Ignore related fetch error
          }
        }
      } catch (err) {
        console.error('Lỗi nạp tư liệu:', err);
        if (mounted) setError(err.message || 'Không thể tải tư liệu');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
      document.title = 'Science - Physics | Kho Dữ Liệu Nghiên Cứu';
    };
  }, [currentMovie]);

  if (!currentMovie) return null;

  const favorited = isFavorite(currentMovie.id, currentMovie.source);

  const sourcesList = detail?.sources || currentMovie?.sources || [];
  const currentEmbedUrl = sourcesList[activeSourceIndex]?.embedUrl || '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Đã sao chép liên kết');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenreClick = (genreSlug) => {
    setActiveGenre(genreSlug);
    setSearchQuery('');
    goHome();
  };

  const handleActorClick = (actorName) => {
    setSearchQuery(actorName);
    goHome();
  };

  return (
    <div className={`relative min-h-screen pb-16 transition-colors duration-300 ${lightsOff ? 'bg-black' : ''}`}>
      {/* Lights Off Overlay Backdrop */}
      {lightsOff && (
        <div
          onClick={() => setLightsOff(false)}
          className="fixed inset-0 bg-black/90 z-40 cursor-pointer backdrop-blur-sm"
          title="Bấm để bật lại đèn"
        />
      )}

      {/* Top Bar Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-border-subtle/60 mb-6">
        <button
          onClick={goHome}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-elevated text-zinc-300 hover:text-white border border-border-subtle text-xs font-mono font-medium cursor-pointer transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Lights Off Toggle */}
          <button
            onClick={() => setLightsOff(!lightsOff)}
            className={`p-2 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
              lightsOff
                ? 'bg-white text-black border-white'
                : 'bg-surface hover:bg-surface-elevated text-zinc-300 hover:text-white border-border-subtle'
            }`}
            title={lightsOff ? 'Bật sáng' : 'Tắt sáng tập trung'}
          >
            {lightsOff ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline">{lightsOff ? 'Bật sáng' : 'Tắt sáng'}</span>
          </button>

          {/* Theater Mode Toggle */}
          <button
            onClick={() => setTheaterMode(!theaterMode)}
            className={`p-2 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-200 hidden md:flex items-center gap-1.5 ${
              theaterMode
                ? 'bg-white text-black border-white'
                : 'bg-surface hover:bg-surface-elevated text-zinc-300 hover:text-white border-border-subtle'
            }`}
            title="Mở rộng khung quan sát"
          >
            {theaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>Mở rộng</span>
          </button>

          {/* Bookmark Toggle */}
          <button
            onClick={() => toggleFavorite(detail || currentMovie)}
            className={`p-2 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
              favorited
                ? 'bg-white text-black border-white'
                : 'bg-surface hover:bg-surface-elevated text-zinc-300 hover:text-white border-border-subtle'
            }`}
            title="Lưu mục"
          >
            <Bookmark className={`w-4 h-4 ${favorited ? 'fill-black' : ''}`} />
            <span className="hidden sm:inline">{favorited ? 'Đã lưu' : 'Lưu'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-lg bg-surface hover:bg-surface-elevated text-zinc-300 hover:text-white border border-border-subtle text-xs font-medium cursor-pointer transition-all duration-200"
            title="Sao chép link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Stream Container */}
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${theaterMode ? 'max-w-full' : 'max-w-7xl'}`}>
        <div className="relative z-50">
          {/* Video Player Box */}
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-border-subtle shadow-2xl">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-foreground-muted font-mono">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs">Đang nạp luồng phát tư liệu...</p>
              </div>
            ) : error ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300 p-6 text-center">
                <AlertCircle className="w-10 h-10 stroke-[1.5] mb-2 text-zinc-400" />
                <p className="text-sm font-semibold mb-1">Không thể tải luồng video</p>
                <p className="text-xs text-foreground-muted mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-lg bg-white text-black text-xs font-medium"
                >
                  Tải lại
                </button>
              </div>
            ) : currentEmbedUrl ? (
              <iframe
                src={currentEmbedUrl}
                title={detail?.title || currentMovie.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-foreground-muted p-6 text-center">
                <Play className="w-10 h-10 stroke-[1.5] mb-2 opacity-30" />
                <p className="text-xs">Chưa có luồng phát trực tiếp</p>
              </div>
            )}
          </div>

          {/* Episode / Server Selector */}
          {sourcesList.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-surface border border-border-subtle flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-zinc-400">
                <Server className="w-4 h-4 text-white" />
                <span>MÁY CHỦ TRUYỀN PHÁT ({sourcesList.length} NGUỒN):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sourcesList.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSourceIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      activeSourceIndex === idx
                        ? 'bg-white text-black font-semibold'
                        : 'bg-surface-elevated hover:bg-surface-highlight text-zinc-300 hover:text-white border border-border-subtle'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{src.name || `Kênh ${idx + 1}`}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Movie Info & Details Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-white text-black">
                  {detail?.quality || currentMovie.quality || 'FHD'}
                </span>

                <span className="px-2 py-0.5 rounded uppercase tracking-wider border bg-black/60 text-zinc-300 border-zinc-700">
                  Nguồn: {currentMovie.source.toUpperCase()}
                </span>

                {(detail?.duration || currentMovie.duration) && (
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-zinc-400 flex items-center gap-1 border border-border-subtle">
                    <Clock className="w-3 h-3" />
                    {detail?.duration || currentMovie.duration}
                  </span>
                )}

                {(detail?.year || currentMovie.year) && (
                  <span className="text-zinc-500">
                    {detail?.year || currentMovie.year}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {detail?.title || currentMovie.title}
              </h1>

              {(detail?.originTitle || currentMovie.originTitle) && (
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Mã tài liệu: {detail?.originTitle || currentMovie.originTitle}
                </p>
              )}
            </div>

            {/* Categories */}
            {((detail?.genres && detail.genres.length > 0) || (currentMovie.genres && currentMovie.genres.length > 0)) && (
              <div className="flex flex-wrap gap-2">
                {(detail?.genres || currentMovie.genres).map((g) => (
                  <button
                    key={g.slug || g.code || g.name}
                    onClick={() => handleGenreClick(g.slug || g.code)}
                    className="px-2.5 py-1 rounded-md text-xs font-mono text-zinc-300 hover:text-white bg-surface-highlight hover:bg-zinc-700 border border-border-subtle cursor-pointer transition-colors duration-150"
                  >
                    #{g.name}
                  </button>
                ))}
              </div>
            )}

            {/* Synopsis Content */}
            <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-3">
              <h3 className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Info className="w-4 h-4 text-white" />
                Mô Tả Tư Liệu
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 whitespace-pre-line">
                {detail?.description ||
                  'Chưa có dữ liệu mô tả bổ sung cho mục này. Bạn có thể theo dõi trực tiếp qua khung phát phía trên.'}
              </p>
            </div>
          </div>

          {/* Cast & Metadata Sidebar */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-surface border border-border-subtle space-y-4">
              <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                Chỉ Số Lưu Trữ
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block mb-1">Nguồn cung cấp:</span>
                  <span className="font-semibold text-white uppercase">
                    {currentMovie.source}
                  </span>
                </div>

                {detail?.actors && detail.actors.length > 0 && (
                  <div>
                    <span className="text-zinc-500 block mb-1">Tác nhân / Diễn viên:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {detail.actors.map((actor, i) => (
                        <button
                          key={i}
                          onClick={() => handleActorClick(actor)}
                          className="px-2 py-0.5 rounded bg-surface-elevated hover:bg-zinc-700 text-zinc-300 hover:text-white border border-border-subtle cursor-pointer transition-colors font-sans text-xs"
                        >
                          {actor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {detail?.director && (
                  <div>
                    <span className="text-zinc-500 block mb-1">Đạo diễn / Tác giả:</span>
                    <span className="text-white font-sans">{detail.director}</span>
                  </div>
                )}

                <div>
                  <span className="text-zinc-500 block mb-1">Độ phân giải:</span>
                  <span className="font-bold text-white">
                    {detail?.quality || currentMovie.quality || 'FHD 1080p'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related / Recommended Movies */}
        {relatedMovies.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border-subtle">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-white" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white font-mono">
                Tư Liệu Đề Xuất Cùng Chủ Đề
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {relatedMovies.map((rel) => (
                <MovieCard key={`${rel.source}-${rel.id}`} movie={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
