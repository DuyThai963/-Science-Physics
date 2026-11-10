import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const STORAGE_KEYS = {
  SOURCE: 'cineadult_source',
  FAVORITES: 'cineadult_favorites',
  HISTORY: 'cineadult_history',
};

export function AppProvider({ children }) {
  // Source Engine: 'vsphim' or 'topxx'
  const [source, setSourceState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SOURCE) || 'vsphim';
  });

  const [activeGenre, setActiveGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('home'); // 'home' | 'watch' | 'library'
  const [libraryTab, setLibraryTab] = useState('favorites'); // 'favorites' | 'history'

  // Advanced Filter state
  const [currentFilter, setCurrentFilter] = useState({
    type: 'latest', // 'latest' | 'genre' | 'country' | 'year' | 'today'
    value: '',
    label: '',
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [currentMovie, setCurrentMovie] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [stealthMode, setStealthMode] = useState(false);

  // Global Boss Key (Escape hotkey)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setStealthMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Watch History
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Apply Filter
  const applyFilter = ({ type = 'latest', value = '', label = '' }) => {
    setCurrentFilter({ type, value, label });
    setSearchQuery('');
    setActiveGenre(type === 'genre' ? value : null);
    setIsFilterModalOpen(false);
    setIsCategoryModalOpen(false);
    if (activeView !== 'home') {
      goHome();
    }
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Reset Filters
  const resetFilters = () => {
    setCurrentFilter({ type: 'latest', value: '', label: '' });
    setActiveGenre(null);
    setSearchQuery('');
    setIsFilterModalOpen(false);
    setIsCategoryModalOpen(false);
    if (activeView !== 'home') {
      goHome();
    }
  };

  // Persist source
  const setSource = (newSource) => {
    if (newSource === source) return;
    setSourceState(newSource);
    localStorage.setItem(STORAGE_KEYS.SOURCE, newSource);
    resetFilters();
    showToast(`Đã chuyển sang nguồn dữ liệu: ${newSource.toUpperCase()}`);
  };

  // Toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  // Save favorites
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  // Save history
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  const toggleFavorite = (movie) => {
    if (!movie || !movie.id) return;
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === movie.id && item.source === movie.source);
      if (exists) {
        showToast('Đã xóa khỏi danh sách đã lưu');
        return prev.filter((item) => !(item.id === movie.id && item.source === movie.source));
      } else {
        showToast('Đã lưu vào danh sách cá nhân');
        return [{ ...movie, savedAt: Date.now() }, ...prev];
      }
    });
  };

  const isFavorite = (movieId, movieSource) => {
    return favorites.some((item) => item.id === movieId && (!movieSource || item.source === movieSource));
  };

  const addToHistory = (movie) => {
    if (!movie || !movie.id) return;
    setHistory((prev) => {
      const filtered = prev.filter((item) => !(item.id === movie.id && item.source === movie.source));
      return [{ ...movie, viewedAt: Date.now() }, ...filtered.slice(0, 49)];
    });
  };

  const clearHistory = () => {
    setHistory([]);
    showToast('Đã xóa sạch lịch sử');
  };

  const openWatch = (movie) => {
    setCurrentMovie(movie);
    setActiveView('watch');
    if (movie.source && movie.source !== source) {
      setSourceState(movie.source);
      localStorage.setItem(STORAGE_KEYS.SOURCE, movie.source);
    }
    addToHistory(movie);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        source,
        setSource,
        activeGenre,
        setActiveGenre,
        searchQuery,
        setSearchQuery,
        currentFilter,
        applyFilter,
        resetFilters,
        isFilterModalOpen,
        setIsFilterModalOpen,
        isCategoryModalOpen,
        setIsCategoryModalOpen,
        activeView,
        setActiveView,
        libraryTab,
        setLibraryTab,
        currentMovie,
        setCurrentMovie,
        openWatch,
        goHome,
        favorites,
        toggleFavorite,
        isFavorite,
        history,
        clearHistory,
        toastMessage,
        showToast,
        stealthMode,
        setStealthMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
