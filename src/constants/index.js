// API Configuration
export const API_BASE_URL = 'https://api.themoviedb.org/3';
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes
export const POSTER_SIZE = 'w500';
export const BACKDROP_SIZE = 'w1280';

// Pagination
export const ITEMS_PER_PAGE = 20;
export const ITEMS_PER_ROW = 4;

// Rate limiting
export const MAX_REQUESTS_PER_WINDOW = 5;
export const RATE_LIMIT_WINDOW_MS = 10000; // 10 seconds

// Search debounce
export const SEARCH_DEBOUNCE_MS = 500;
export const MIN_SEARCH_LENGTH = 2;

// Category focus delay
export const CATEGORY_FOCUS_DELAY_MS = 2000;

// Filter types
export const FILTER_TYPES = {
  POPULAR: 'popular',
  AIRING_NOW: 'airing_now',
  FAVORITES: 'favorites',
};

// Local storage keys
export const FAVORITES_STORAGE_KEY = 'movieFavorites';

// Keyboard keys
export const KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
};
