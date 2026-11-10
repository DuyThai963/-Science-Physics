// Science - Physics API Client

const BASE_URL = '/api';

export async function fetchLatestMovies(source = 'vsphim', page = 1) {
  const res = await fetch(`${BASE_URL}/movies/latest?source=${encodeURIComponent(source)}&page=${page}`);
  if (!res.ok) throw new Error('Không thể tải danh sách tài liệu mới');
  return await res.json();
}

export async function searchMovies(source = 'vsphim', query = '', page = 1) {
  if (!query.trim()) return { items: [], total: 0, totalPages: 0 };
  const res = await fetch(`${BASE_URL}/movies/search?source=${encodeURIComponent(source)}&q=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error('Không thể tìm kiếm tài liệu');
  return await res.json();
}

export async function fetchGenres(source = 'vsphim') {
  const res = await fetch(`${BASE_URL}/movies/genres?source=${encodeURIComponent(source)}`);
  if (!res.ok) throw new Error('Không thể tải danh sách chủ đề');
  return await res.json();
}

export async function fetchMoviesByGenre(source = 'vsphim', slug = '', page = 1) {
  const res = await fetch(`${BASE_URL}/movies/by-genre?source=${encodeURIComponent(source)}&slug=${encodeURIComponent(slug)}&page=${page}`);
  if (!res.ok) throw new Error('Không thể tải tài liệu theo chủ đề');
  return await res.json();
}

export async function fetchCountries(source = 'vsphim') {
  const res = await fetch(`${BASE_URL}/movies/countries?source=${encodeURIComponent(source)}`);
  if (!res.ok) throw new Error('Không thể tải danh sách quốc gia');
  return await res.json();
}

export async function fetchMoviesByCountry(source = 'vsphim', slug = '', page = 1) {
  const res = await fetch(`${BASE_URL}/movies/by-country?source=${encodeURIComponent(source)}&slug=${encodeURIComponent(slug)}&page=${page}`);
  if (!res.ok) throw new Error('Không thể tải tài liệu theo quốc gia');
  return await res.json();
}

export async function fetchYears() {
  const res = await fetch(`${BASE_URL}/movies/years`);
  if (!res.ok) throw new Error('Không thể tải danh sách năm');
  return await res.json();
}

export async function fetchMoviesByYear(year = '', page = 1) {
  const res = await fetch(`${BASE_URL}/movies/by-year?year=${encodeURIComponent(year)}&page=${page}`);
  if (!res.ok) throw new Error('Không thể tải tài liệu theo năm');
  return await res.json();
}

export async function fetchMoviesToday(page = 1) {
  const res = await fetch(`${BASE_URL}/movies/today?page=${page}`);
  if (!res.ok) throw new Error('Không thể tải tài liệu hôm nay');
  return await res.json();
}

export async function fetchMovieDetail(source = 'vsphim', id = '') {
  const res = await fetch(`${BASE_URL}/movies/detail?source=${encodeURIComponent(source)}&id=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error('Không thể tải chi tiết tài liệu');
  return await res.json();
}
