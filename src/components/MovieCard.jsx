// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 4/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Bookmark, Clock, Copy, Check } from 'lucide-react';

export default function MovieCard({ movie }) {
  const { openWatch, toggleFavorite, isFavorite, showToast } = useApp();
  const [imgError, setImgError] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!movie) return null;

  const favorited = isFavorite(movie.id, movie.source);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const handleCopyCode = (e) => {
    e.stopPropagation();
    const code = movie.originTitle || movie.code || movie.id;
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      showToast(`Đã sao chép mã: ${code}`);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const posterSrc = imgError
    ? 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=500&auto=format&fit=crop&q=80'
    : movie.thumbnail || movie.poster;

  return (
    <article
      onClick={() => openWatch(movie)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openWatch(movie);
        }
      }}
      className="group relative flex flex-col bg-surface border border-border-subtle hover:border-zinc-500 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-card-elevated hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white"
      aria-label={`Xem tư liệu ${movie.title}`}
    >
      {/* Thumbnail Aspect 3:4 */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-elevated">
        <img
          src={posterSrc}
          alt={movie.title}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40 opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

        {/* Source Badge (Top-Left) */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-black/80 text-zinc-300 border border-zinc-700/80 backdrop-blur-sm">
            {movie.source}
          </span>
        </div>

        {/* Bookmark Button (Top-Right) */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Xóa khỏi lưu trữ' : 'Lưu tài liệu'}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-md backdrop-blur-md border transition-all duration-200 cursor-pointer ${
            favorited
              ? 'bg-white text-black border-white'
              : 'bg-black/60 text-zinc-400 hover:text-white hover:bg-black/90 border-zinc-700/60'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${favorited ? 'fill-black' : ''}`} />
        </button>

        {/* Quality Badge (Bottom-Left) */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 font-mono">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white text-black uppercase tracking-wider">
            {movie.quality || 'FHD'}
          </span>
        </div>

        {/* Duration Badge (Bottom-Right) */}
        {movie.duration && (
          <div className="absolute bottom-2.5 right-2.5">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-300 bg-black/80 backdrop-blur-sm border border-zinc-700/80 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-zinc-400" />
              {movie.duration}
            </span>
          </div>
        )}

        {/* Hover Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3 flex flex-col flex-grow justify-between bg-surface">
        <div>
          <h3 className="font-medium text-xs sm:text-sm text-foreground-primary group-hover:text-white transition-colors duration-200 line-clamp-2 leading-snug">
            {movie.title}
          </h3>

          {movie.originTitle && (
            <p className="text-[11px] font-mono text-foreground-muted mt-1 truncate">
              {movie.originTitle}
            </p>
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-2.5 pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-foreground-muted">
          <span className="truncate max-w-[70%]">
            {movie.genres && movie.genres.length > 0
              ? movie.genres.map((g) => g.name).slice(0, 2).join(', ')
              : movie.source.toUpperCase()}
          </span>
          {movie.year && <span className="font-mono text-zinc-400 shrink-0">{movie.year}</span>}
        </div>
      </div>
    </article>
  );
}
