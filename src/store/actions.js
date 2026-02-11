import * as types from './actionTypes';

// Movie actions
export const fetchMoviesRequest = (filterType, page = 1) => ({
  type: types.FETCH_MOVIES_REQUEST,
  payload: { filterType, page },
});

export const fetchMoviesSuccess = (movies, totalPages, filterType, page) => ({
  type: types.FETCH_MOVIES_SUCCESS,
  payload: { movies, totalPages, filterType, page },
});

export const fetchMoviesFailure = (error) => ({
  type: types.FETCH_MOVIES_FAILURE,
  payload: { error },
});

export const fetchMovieDetailsRequest = (movieId) => ({
  type: types.FETCH_MOVIE_DETAILS_REQUEST,
  payload: { movieId },
});

export const fetchMovieDetailsSuccess = (movie) => ({
  type: types.FETCH_MOVIE_DETAILS_SUCCESS,
  payload: { movie },
});

export const fetchMovieDetailsFailure = (error) => ({
  type: types.FETCH_MOVIE_DETAILS_FAILURE,
  payload: { error },
});

export const searchMoviesRequest = (query, page = 1) => ({
  type: types.SEARCH_MOVIES_REQUEST,
  payload: { query, page },
});

export const searchMoviesSuccess = (movies, totalPages, query, page) => ({
  type: types.SEARCH_MOVIES_SUCCESS,
  payload: { movies, totalPages, query, page },
});

export const searchMoviesFailure = (error) => ({
  type: types.SEARCH_MOVIES_FAILURE,
  payload: { error },
});

export const setActiveFilter = (filterType) => ({
  type: types.SET_ACTIVE_FILTER,
  payload: { filterType },
});

export const setCurrentPage = (page) => ({
  type: types.SET_CURRENT_PAGE,
  payload: { page },
});

export const setSearchQuery = (query) => ({
  type: types.SET_SEARCH_QUERY,
  payload: { query },
});

export const clearSearch = () => ({
  type: types.CLEAR_SEARCH,
});

// Favorites actions
export const addToFavorites = (movie) => ({
  type: types.ADD_TO_FAVORITES,
  payload: { movie },
});

export const removeFromFavorites = (movieId) => ({
  type: types.REMOVE_FROM_FAVORITES,
  payload: { movieId },
});

export const loadFavorites = () => ({
  type: types.LOAD_FAVORITES,
});

// Navigation actions
export const setFocusedIndex = (index) => ({
  type: types.SET_FOCUSED_INDEX,
  payload: { index },
});

export const navigateUp = () => ({
  type: types.NAVIGATE_UP,
});

export const navigateDown = () => ({
  type: types.NAVIGATE_DOWN,
});

export const navigateLeft = () => ({
  type: types.NAVIGATE_LEFT,
});

export const navigateRight = () => ({
  type: types.NAVIGATE_RIGHT,
});
