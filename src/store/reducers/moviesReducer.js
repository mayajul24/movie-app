import * as types from '../actionTypes';
import { FILTER_TYPES } from '../../constants';

const initialState = {
  movies: [],
  currentMovie: null,
  activeFilter: FILTER_TYPES.POPULAR,
  currentPage: 1,
  totalPages: 0,
  searchQuery: '',
  isSearching: false,
  loading: false,
  error: null,
};

const moviesReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.FETCH_MOVIES_REQUEST:
    case types.FETCH_MOVIE_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };

    case types.SEARCH_MOVIES_REQUEST:
      return { ...state, loading: true, error: null, isSearching: true };

    case types.FETCH_MOVIES_SUCCESS:
    case types.SEARCH_MOVIES_SUCCESS:
      return {
        ...state,
        movies: payload.movies,
        totalPages: payload.totalPages,
        currentPage: payload.page,
        loading: false,
        error: null,
        isSearching: type === types.SEARCH_MOVIES_SUCCESS,
      };

    case types.FETCH_MOVIE_DETAILS_SUCCESS:
      return { ...state, currentMovie: payload.movie, loading: false, error: null };

    case types.FETCH_MOVIES_FAILURE:
    case types.FETCH_MOVIE_DETAILS_FAILURE:
    case types.SEARCH_MOVIES_FAILURE:
      return { ...state, loading: false, error: payload.error };

    case types.SET_ACTIVE_FILTER:
      return {
        ...state,
        activeFilter: payload.filterType,
        currentPage: 1,
        searchQuery: '',
        isSearching: false,
      };

    case types.SET_CURRENT_PAGE:
      return { ...state, currentPage: payload.page };

    case types.SET_SEARCH_QUERY:
      return { ...state, searchQuery: payload.query };

    case types.CLEAR_SEARCH:
      return { ...state, searchQuery: '', isSearching: false, currentPage: 1 };

    default:
      return state;
  }
};

export default moviesReducer;
