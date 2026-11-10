// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 4/10 | Density: 7/10 | Accent: Stark White (#FFFFFF)
import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, Bookmark, Clock, Eye } from 'lucide-react';

export default function HeroFeatured({ movie }) {
  const { openWatch, toggleFavorite, isFavorite } = useApp();

  if (!movie) return null;

  const favorited = isFavorite(movie.id, movie.source);

  return (
    <section className="relative w-full rounded-2xl overflow-hidden border border-border-subtle bg-surface mb-8 group">
      {/* Background Image with Dark Linear Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={movie.poster || movie.thumbnail}
          alt={movie.title}
          className="w-full h-full object-cover object-top opacity-30 filter grayscale group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl flex flex-col justify-end min-h-[380px] sm:min-h-[420px]">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3 font-mono text-[11px]">
          <span className="px-2.5 py-1 rounded bg-white text-black font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3 h-3" />
            Nổi Bật ({movie.source.toUpperCase()})
          </span>

          <span className="px-2.5 py-1 rounded bg-surface-elevated text-zinc-300 border border-border-strong uppercase">
            {movie.quality || 'FHD'}
          </span>

          {movie.duration && (
            <span className="px-2.5 py-1 rounded bg-surface-elevated text-zinc-400 border border-border-subtle flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {movie.duration}
            </span>
          )}

          {movie.year && (
            <span className="px-2.5 py-1 rounded text-foreground-muted">
              {movie.year}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug line-clamp-2 mb-3">
          {movie.title}
        </h1>

        {/* Original Title / Code */}
        {movie.originTitle && (
          <p className="text-xs sm:text-sm font-mono text-zinc-400 mb-3 line-clamp-1">
            Mã lưu trữ: {movie.originTitle}
          </p>
        )}

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {movie.genres.slice(0, 4).map((g) => (
              <span
                key={g.slug || g.code || g.name}
                className="text-xs text-zinc-400 bg-surface-highlight px-2.5 py-1 rounded border border-border-subtle"
              >
                {g.name}
              </span>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => openWatch(movie)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>XEM TƯ LIỆU NGAY</span>
          </button>

          <button
            onClick={() => toggleFavorite(movie)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium text-xs transition-all duration-200 cursor-pointer active:scale-95 ${
              favorited
                ? 'bg-surface-elevated text-white border-white'
                : 'bg-surface hover:bg-surface-elevated border-border-subtle text-zinc-400 hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${favorited ? 'fill-white' : ''}`} />
            <span>{favorited ? 'Đã Lưu' : 'Lưu Danh Mục'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
