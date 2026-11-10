import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Simple In-Memory Cache
const cache = new Map();
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key, data, ttl = CACHE_TTL_MS) {
  cache.set(key, { data, expiresAt: Date.now() + ttl });
}

// Upstream fetch helper with user-agent
async function safeFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'application/json, text/plain, */*',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Upstream ${url} returned HTTP ${res.status}`);
  }
  return await res.json();
}

// ----------------------------------------------------
// NORMALIZERS
// ----------------------------------------------------

function normalizeVsphimMovie(item, pathImage = '') {
  const baseImg = pathImage || 'https://img.vsphim.com/upload/vod/';
  let thumb = item.thumb_url || item.poster_url || '';
  if (thumb && !thumb.startsWith('http')) {
    thumb = `${baseImg.replace(/\/$/, '')}/${thumb.replace(/^\//, '')}`;
  }
  let poster = item.poster_url || item.thumb_url || '';
  if (poster && !poster.startsWith('http')) {
    poster = `${baseImg.replace(/\/$/, '')}/${poster.replace(/^\//, '')}`;
  }

  const genres = Array.isArray(item.category)
    ? item.category.map((c) => ({ name: c.name, slug: c.slug }))
    : [];

  return {
    id: item.slug || item._id,
    code: item.slug,
    slug: item.slug,
    title: item.name || 'Chưa có tiêu đề',
    originTitle: item.origin_name || '',
    thumbnail: thumb || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    poster: poster || thumb,
    quality: item.quality || item.episode_current || 'HD',
    duration: item.time || '',
    year: item.year || '',
    genres,
    source: 'vsphim',
  };
}

function normalizeTopxxMovie(item) {
  const transVi = (item.trans || []).find((t) => t.locale === 'vi') || item.trans?.[0] || {};
  const genres = (item.genres || []).map((g) => {
    const t = (g.trans || []).find((tr) => tr.locale === 'vi') || g.trans?.[0] || {};
    return {
      name: t.name || g.code,
      slug: g.code,
      code: g.code,
    };
  });

  const sources = (item.sources || []).map((s) => ({
    name: 'Player',
    embedUrl: s.link,
    type: s.type || 'embed',
  }));

  return {
    id: item.code,
    code: item.code,
    slug: transVi.slug || item.code,
    title: transVi.title || item.code,
    originTitle: item.code,
    thumbnail: item.thumbnail || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    poster: item.thumbnail,
    quality: item.quality || 'FHD',
    duration: item.duration || '',
    year: item.publish_at ? new Date(item.publish_at).getFullYear() : '',
    genres,
    sources,
    source: 'topxx',
  };
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. GET /api/movies/latest?source=vsphim|topxx&page=1
app.get('/api/movies/latest', async (req, res) => {
  const source = (req.query.source || 'vsphim').toLowerCase();
  const page = parseInt(req.query.page, 10) || 1;
  const cacheKey = `latest:${source}:${page}`;

  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    if (source === 'topxx') {
      const url = `https://topxx.vip/api/v1/movies/latest?page=${page}&per_page=24`;
      const data = await safeFetch(url);
      const items = (data.data || []).map(normalizeTopxxMovie);
      const total = data.meta?.total || 1000;
      const lastPage = data.meta?.last_page || Math.ceil(total / 24);

      const responsePayload = {
        source: 'topxx',
        page,
        total,
        totalPages: lastPage,
        items,
      };
      setCached(cacheKey, responsePayload);
      return res.json(responsePayload);
    } else {
      // Default: vsphim
      const url = `https://nguon.vsphim.com/api/danh-sach/phim-moi-cap-nhat?page=${page}`;
      const data = await safeFetch(url);
      const pathImage = data.pathImage || '';
      const items = (data.items || []).map((item) => normalizeVsphimMovie(item, pathImage));
      const total = data.pagination?.totalItems || 1000;
      const totalPages = Math.ceil(total / (data.pagination?.totalItemsPerPage || 24));

      const responsePayload = {
        source: 'vsphim',
        page,
        total,
        totalPages,
        items,
      };
      setCached(cacheKey, responsePayload);
      return res.json(responsePayload);
    }
  } catch (error) {
    console.error(`[Error /api/movies/latest] source=${source}:`, error.message);
    return res.status(500).json({ error: error.message, source, items: [] });
  }
});

// 2. GET /api/movies/search?source=vsphim|topxx&q=keyword&page=1
app.get('/api/movies/search', async (req, res) => {
  const source = (req.query.source || 'vsphim').toLowerCase();
  const q = (req.query.q || '').trim();
  const page = parseInt(req.query.page, 10) || 1;

  if (!q) {
    return res.json({ source, page: 1, total: 0, totalPages: 0, items: [] });
  }

  const cacheKey = `search:${source}:${encodeURIComponent(q)}:${page}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    if (source === 'topxx') {
      const url = `https://topxx.vip/api/v1/movies/search?q=${encodeURIComponent(q)}&page=${page}`;
      const data = await safeFetch(url);
      const items = (data.data || []).map(normalizeTopxxMovie);
      const total = data.meta?.total || items.length;
      const totalPages = data.meta?.last_page || (items.length > 0 ? 1 : 0);

      const responsePayload = {
        source: 'topxx',
        page,
        total,
        totalPages,
        items,
      };
      setCached(cacheKey, responsePayload, 60 * 1000);
      return res.json(responsePayload);
    } else {
      const url = `https://nguon.vsphim.com/api/tim-kiem?keyword=${encodeURIComponent(q)}&page=${page}`;
      const data = await safeFetch(url);
      const pathImage = data.pathImage || '';
      const items = (data.items || []).map((item) => normalizeVsphimMovie(item, pathImage));
      const total = data.pagination?.totalItems || items.length;
      const totalPages = Math.ceil(total / (data.pagination?.totalItemsPerPage || 24)) || 1;

      const responsePayload = {
        source: 'vsphim',
        page,
        total,
        totalPages,
        items,
      };
      setCached(cacheKey, responsePayload, 60 * 1000);
      return res.json(responsePayload);
    }
  } catch (error) {
    console.error(`[Error /api/movies/search] source=${source} q=${q}:`, error.message);
    return res.status(500).json({ error: error.message, source, items: [] });
  }
});

// Curated Popular Genres for VSPhim
const POPULAR_VSPHIM_GENRES = [
  { name: 'JAV', slug: 'jav' },
  { name: 'Vietsub', slug: 'vietsub' },
  { name: 'Không Che (Uncensored)', slug: 'khong-che' },
  { name: 'Loạn Luân', slug: 'loan-luan' },
  { name: 'Ngoại Tình / Vụng Trộm', slug: 'vung-trom' },
  { name: 'Gái Xinh', slug: 'gai-xinh' },
  { name: 'Nữ Sinh / Học Đường', slug: 'hoc-sinh' },
  { name: 'Văn Phòng / Công Sở', slug: 'van-phong' },
  { name: 'Cosplay', slug: 'cosplay' },
  { name: 'BDSM', slug: 'bdsm' },
  { name: 'Massage', slug: 'massage' },
  { name: 'Âu Mỹ', slug: 'au-my' },
  { name: 'Châu Á', slug: 'chau-a' },
  { name: 'Y Tá / Bác Sĩ', slug: 'y-ta' },
  { name: 'Hiếp Dâm / Cưỡng Bức', slug: 'hiep-dam' },
];

// 3. GET /api/movies/genres?source=vsphim|topxx
app.get('/api/movies/genres', async (req, res) => {
  const source = (req.query.source || 'vsphim').toLowerCase();
  const cacheKey = `genres:${source}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    if (source === 'topxx') {
      const url = `https://topxx.vip/api/v1/genres?locale=vi&per_page=50`;
      const data = await safeFetch(url);
      const genres = (data.data || []).map((g) => {
        const trans = (g.translations || []).find((t) => t.locale === 'vi') || g.translations?.[0] || {};
        return {
          code: g.code,
          slug: g.code,
          name: trans.name || g.code,
          count: g.movies_count || 0,
        };
      });
      const responsePayload = { source: 'topxx', genres };
      setCached(cacheKey, responsePayload, 60 * 60 * 1000);
      return res.json(responsePayload);
    } else {
      // Return curated list for VSPhim
      const responsePayload = { source: 'vsphim', genres: POPULAR_VSPHIM_GENRES };
      setCached(cacheKey, responsePayload, 60 * 60 * 1000);
      return res.json(responsePayload);
    }
  } catch (error) {
    console.error(`[Error /api/movies/genres] source=${source}:`, error.message);
    return res.status(500).json({ error: error.message, source, genres: [] });
  }
});

// 4. GET /api/movies/by-genre?source=vsphim|topxx&slug=slug-code&page=1
app.get('/api/movies/by-genre', async (req, res) => {
  const source = (req.query.source || 'vsphim').toLowerCase();
  const slug = (req.query.slug || '').trim();
  const page = parseInt(req.query.page, 10) || 1;

  if (!slug) {
    return res.status(400).json({ error: 'Missing slug parameter' });
  }

  const cacheKey = `genre:${source}:${slug}:${page}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    if (source === 'topxx') {
      const url = `https://topxx.vip/api/v1/genres/${encodeURIComponent(slug)}/movies?page=${page}`;
      const data = await safeFetch(url);
      const items = (data.data || []).map(normalizeTopxxMovie);
      const total = data.meta?.total || items.length;
      const totalPages = data.meta?.last_page || 1;

      const responsePayload = {
        source: 'topxx',
        slug,
        page,
        total,
        totalPages,
        items,
      };
      setCached(cacheKey, responsePayload);
      return res.json(responsePayload);
    } else {
      const url = `https://nguon.vsphim.com/api/the-loai/${encodeURIComponent(slug)}?page=${page}`;
      const data = await safeFetch(url);
      const pathImage = data.pathImage || '';
      const items = (data.items || []).map((item) => normalizeVsphimMovie(item, pathImage));
      const total = data.pagination?.totalItems || items.length;
      const totalPages = Math.ceil(total / (data.pagination?.totalItemsPerPage || 24)) || 1;

      const responsePayload = {
        source: 'vsphim',
        slug,
        page,
        total,
        totalPages,
        items,
      };
      setCached(cacheKey, responsePayload);
      return res.json(responsePayload);
    }
  } catch (error) {
    console.error(`[Error /api/movies/by-genre] source=${source} slug=${slug}:`, error.message);
    return res.status(500).json({ error: error.message, source, items: [] });
  }
});

// Popular countries for VSPhim
const POPULAR_VSPHIM_COUNTRIES = [
  { name: 'Nhật Bản', slug: 'nhat-ban' },
  { name: 'Hàn Quốc', slug: 'han-quoc' },
  { name: 'Âu Mỹ', slug: 'au-my' },
  { name: 'Trung Quốc', slug: 'trung-quoc' },
  { name: 'Đài Loan', slug: 'dai-loan' },
  { name: 'Thái Lan', slug: 'thai-lan' },
  { name: 'Nga', slug: 'nga' },
  { name: 'Pháp', slug: 'phap' },
];

const POPULAR_YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];

// GET /api/movies/countries?source=vsphim|topxx
app.get('/api/movies/countries', async (req, res) => {
  const source = (req.query.source || 'vsphim').toLowerCase();
  const cacheKey = `countries:${source}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    if (source === 'topxx') {
      const url = `https://topxx.vip/api/v1/countries?locale=vi`;
      const data = await safeFetch(url);
      const countries = (data.data || []).map((c) => {
        const trans = (c.translations || []).find((t) => t.locale === 'vi') || c.translations?.[0] || {};
        return {
          code: c.code,
          slug: c.code,
          name: trans.name || c.code,
          count: c.movies_count || 0,
        };
      });
      const responsePayload = { source: 'topxx', countries };
      setCached(cacheKey, responsePayload, 60 * 60 * 1000);
      return res.json(responsePayload);
    } else {
      const responsePayload = { source: 'vsphim', countries: POPULAR_VSPHIM_COUNTRIES };
      setCached(cacheKey, responsePayload, 60 * 60 * 1000);
      return res.json(responsePayload);
    }
  } catch (error) {
    console.error(`[Error /api/movies/countries] source=${source}:`, error.message);
    return res.status(500).json({ error: error.message, source, countries: [] });
  }
});

// GET /api/movies/by-country?source=vsphim|topxx&slug=...&page=1
app.get('/api/movies/by-country', async (req, res) => {
  const source = (req.query.source || 'vsphim').toLowerCase();
  const slug = (req.query.slug || '').trim();
  const page = parseInt(req.query.page, 10) || 1;

  if (!slug) return res.status(400).json({ error: 'Missing slug' });

  const cacheKey = `country:${source}:${slug}:${page}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    if (source === 'topxx') {
      const url = `https://topxx.vip/api/v1/countries/${encodeURIComponent(slug)}/movies?page=${page}`;
      const data = await safeFetch(url);
      const items = (data.data || []).map(normalizeTopxxMovie);
      const total = data.meta?.total || items.length;
      const totalPages = data.meta?.last_page || 1;
      const responsePayload = { source: 'topxx', slug, page, total, totalPages, items };
      setCached(cacheKey, responsePayload);
      return res.json(responsePayload);
    } else {
      const url = `https://nguon.vsphim.com/api/quoc-gia/${encodeURIComponent(slug)}?page=${page}`;
      const data = await safeFetch(url);
      const pathImage = data.pathImage || '';
      const items = (data.items || []).map((item) => normalizeVsphimMovie(item, pathImage));
      const total = data.pagination?.totalItems || items.length;
      const totalPages = Math.ceil(total / (data.pagination?.totalItemsPerPage || 24)) || 1;
      const responsePayload = { source: 'vsphim', slug, page, total, totalPages, items };
      setCached(cacheKey, responsePayload);
      return res.json(responsePayload);
    }
  } catch (error) {
    console.error(`[Error /api/movies/by-country] source=${source} slug=${slug}:`, error.message);
    return res.status(500).json({ error: error.message, source, items: [] });
  }
});

// GET /api/movies/years
app.get('/api/movies/years', (req, res) => {
  return res.json({ years: POPULAR_YEARS });
});

// GET /api/movies/by-year?year=2026&page=1
app.get('/api/movies/by-year', async (req, res) => {
  const year = (req.query.year || '').trim();
  const page = parseInt(req.query.page, 10) || 1;
  if (!year) return res.status(400).json({ error: 'Missing year' });

  const cacheKey = `year:vsphim:${year}:${page}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const url = `https://nguon.vsphim.com/api/nam/${encodeURIComponent(year)}?page=${page}`;
    const data = await safeFetch(url);
    const pathImage = data.pathImage || '';
    const items = (data.items || []).map((item) => normalizeVsphimMovie(item, pathImage));
    const total = data.pagination?.totalItems || items.length;
    const totalPages = Math.ceil(total / (data.pagination?.totalItemsPerPage || 24)) || 1;
    const responsePayload = { source: 'vsphim', year, page, total, totalPages, items };
    setCached(cacheKey, responsePayload);
    return res.json(responsePayload);
  } catch (error) {
    console.error(`[Error /api/movies/by-year] year=${year}:`, error.message);
    return res.status(500).json({ error: error.message, source: 'vsphim', items: [] });
  }
});

// GET /api/movies/today (TopXX)
app.get('/api/movies/today', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const cacheKey = `today:topxx:${page}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const url = `https://topxx.vip/api/v1/movies/today?page=${page}&per_page=24`;
    const data = await safeFetch(url);
    const items = (data.data || []).map(normalizeTopxxMovie);
    const total = data.meta?.total || items.length;
    const totalPages = data.meta?.last_page || 1;
    const responsePayload = { source: 'topxx', filter: 'today', page, total, totalPages, items };
    setCached(cacheKey, responsePayload, 5 * 60 * 1000);
    return res.json(responsePayload);
  } catch (error) {
    console.error(`[Error /api/movies/today]:`, error.message);
    return res.status(500).json({ error: error.message, source: 'topxx', items: [] });
  }
});

// 5. GET /api/movies/detail?source=vsphim|topxx&id=code-or-slug
app.get('/api/movies/detail', async (req, res) => {
  const source = (req.query.source || 'vsphim').toLowerCase();
  const id = (req.query.id || '').trim();

  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }

  const cacheKey = `detail:${source}:${id}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    if (source === 'topxx') {
      const url = `https://topxx.vip/api/v1/movies/${encodeURIComponent(id)}`;
      const data = await safeFetch(url);
      const movieData = data.data;
      if (!movieData) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      const transVi = (movieData.trans || []).find((t) => t.locale === 'vi') || movieData.trans?.[0] || {};
      const genres = (movieData.genres || []).map((g) => {
        const t = (g.trans || []).find((tr) => tr.locale === 'vi') || g.trans?.[0] || {};
        return { name: t.name || g.code, slug: g.code, code: g.code };
      });

      const actors = (movieData.actors || []).map((a) => {
        const t = (a.trans || []).find((tr) => tr.locale === 'vi') || a.trans?.[0] || {};
        return t.name || a.code || 'Diễn viên';
      });

      const sources = (movieData.sources || []).map((s, idx) => ({
        name: `Server ${idx + 1} (${s.type || 'Embed'})`,
        embedUrl: s.link,
        type: s.type || 'embed',
      }));

      const normalized = {
        id: movieData.code,
        code: movieData.code,
        slug: transVi.slug || movieData.code,
        title: transVi.title || movieData.code,
        originTitle: movieData.code,
        description: transVi.description || '',
        thumbnail: movieData.thumbnail,
        poster: movieData.thumbnail,
        quality: movieData.quality || 'FHD',
        duration: movieData.duration || '',
        year: movieData.publish_at ? new Date(movieData.publish_at).getFullYear() : '',
        genres,
        actors,
        director: '',
        sources,
        episodes: [
          {
            server_name: 'VIP Stream',
            server_data: sources.map((s, idx) => ({
              name: `Phần ${idx + 1}`,
              link_embed: s.embedUrl,
            })),
          },
        ],
        source: 'topxx',
      };

      setCached(cacheKey, normalized, 10 * 60 * 1000);
      return res.json(normalized);
    } else {
      // vsphim
      const url = `https://nguon.vsphim.com/api/phim/${encodeURIComponent(id)}`;
      const data = await safeFetch(url);
      const m = data.movie;
      if (!m) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      const baseImg = 'https://img.vsphim.com/upload/vod/';
      let thumb = m.thumb_url || m.poster_url || '';
      if (thumb && !thumb.startsWith('http')) {
        thumb = `${baseImg.replace(/\/$/, '')}/${thumb.replace(/^\//, '')}`;
      }
      let poster = m.poster_url || m.thumb_url || '';
      if (poster && !poster.startsWith('http')) {
        poster = `${baseImg.replace(/\/$/, '')}/${poster.replace(/^\//, '')}`;
      }

      const genres = Array.isArray(m.category)
        ? m.category.map((c) => ({ name: c.name, slug: c.slug }))
        : [];

      // Collect all servers & episodes
      const rawEpisodes = data.episodes || [];
      const sources = [];

      rawEpisodes.forEach((serv) => {
        (serv.server_data || []).forEach((ep) => {
          if (ep.link_embed || ep.link_m3u8) {
            sources.push({
              name: `${serv.server_name || 'VIP'} - ${ep.name || 'Full'}`,
              embedUrl: ep.link_embed || ep.link_m3u8,
              type: ep.link_m3u8 ? 'm3u8' : 'embed',
            });
          }
        });
      });

      const normalized = {
        id: m.slug || m._id,
        code: m.slug,
        slug: m.slug,
        title: m.name,
        originTitle: m.origin_name || '',
        description: m.content ? m.content.replace(/<[^>]+>/g, '') : '',
        thumbnail: thumb,
        poster: poster || thumb,
        quality: m.quality || m.episode_current || 'HD',
        duration: m.time || '',
        year: m.year || '',
        genres,
        actors: Array.isArray(m.actor) ? m.actor : (m.actor ? [m.actor] : []),
        director: Array.isArray(m.director) ? m.director.join(', ') : (m.director || ''),
        sources,
        episodes: rawEpisodes,
        source: 'vsphim',
      };

      setCached(cacheKey, normalized, 10 * 60 * 1000);
      return res.json(normalized);
    }
  } catch (error) {
    console.error(`[Error /api/movies/detail] source=${source} id=${id}:`, error.message);
    return res.status(500).json({ error: error.message, source });
  }
});

// Serve frontend in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.send(`<!DOCTYPE html>
<html>
<head><title>Science - Physics Server Active</title></head>
<body style="background:#09090b;color:#fff;font-family:sans-serif;padding:40px;text-align:center;">
  <h2>Science - Physics API Server is running on port ${PORT}</h2>
  <p style="color:#a1a1aa">Run "npm run dev" to start Vite frontend dev server with live hot reload, or run "npm run build" to generate production dist.</p>
</body>
</html>`);
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Science - Physics Server] Running at http://127.0.0.1:${PORT}`);
});
