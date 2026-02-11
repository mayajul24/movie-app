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
  switch (action.type) {
    case types.FETCH_MOVIES_REQUEST:
    case types.FETCH_MOVIE_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.SEARCH_MOVIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        isSearching: true,
      };

    case types.FETCH_MOVIES_SUCCESS:
      return {
        ...state,
        movies: action.payload.movies,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.page,
        loading: false,
        error: null,
      };

    case types.SEARCH_MOVIES_SUCCESS:
      return {
        ...state,
        movies: action.payload.movies,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.page,
        loading: false,
        error: null,
        isSearching: true,
      };

    case types.FETCH_MOVIE_DETAILS_SUCCESS:
      return {
        ...state,
        currentMovie: action.payload.movie,
        loading: false,
        error: null,
      };

    case types.FETCH_MOVIES_FAILURE:
    case types.FETCH_MOVIE_DETAILS_FAILURE:
    case types.SEARCH_MOVIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case types.SET_ACTIVE_FILTER:
      return {
        ...state,
        activeFilter: action.payload.filterType,
        currentPage: 1,
        searchQuery: '',
        isSearching: false,
      };

    case types.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload.page,
      };

    case types.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload.query,
      };

    case types.CLEAR_SEARCH:
      return {
        ...state,
        searchQuery: '',
        isSearching: false,
        currentPage: 1,
      };

    default:
      return state;
  }
};

export default moviesReducer;
