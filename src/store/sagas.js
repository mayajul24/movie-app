import { call, put, takeLatest, debounce, select, all } from 'redux-saga/effects';
import * as types from './actionTypes';
import * as actions from './actions';
import * as api from '../services/api';
import { FILTER_TYPES, SEARCH_DEBOUNCE_MS, MIN_SEARCH_LENGTH } from '../constants';

const getFavorites = (state) => state.favorites.favorites;

const fetchByFilterType = {
  [FILTER_TYPES.POPULAR]: api.fetchPopularMovies,
  [FILTER_TYPES.AIRING_NOW]: api.fetchNowPlayingMovies,
};

function* fetchMoviesSaga(action) {
  try {
    const { filterType, page } = action.payload;

    if (filterType === FILTER_TYPES.FAVORITES) {
      const favorites = yield select(getFavorites);
      yield put(actions.fetchMoviesSuccess(favorites, 1, filterType, 1));
      return;
    }

    const apiFn = fetchByFilterType[filterType];
    if (!apiFn) {
      yield put(actions.fetchMoviesFailure(`Unknown filter type: ${filterType}`));
      return;
    }

    const response = yield call(apiFn, page);
    yield put(
      actions.fetchMoviesSuccess(response.results, response.total_pages, filterType, page)
    );
  } catch (error) {
    const errorMessage = error.message || 'Failed to fetch movies. Please check your API key.';
    yield put(actions.fetchMoviesFailure(errorMessage));
  }
}

function* fetchMovieDetailsSaga(action) {
  try {
    const movie = yield call(api.fetchMovieDetails, action.payload.movieId);
    yield put(actions.fetchMovieDetailsSuccess(movie));
  } catch (error) {
    yield put(actions.fetchMovieDetailsFailure(error.message));
  }
}

function* searchMoviesSaga(action) {
  try {
    const { query, page } = action.payload;

    if (!query || query.length < MIN_SEARCH_LENGTH) {
      yield put(actions.clearSearch());
      return;
    }

    const response = yield call(api.searchMovies, query, page);
    yield put(
      actions.searchMoviesSuccess(response.results, response.total_pages, query, page)
    );
  } catch (error) {
    yield put(actions.searchMoviesFailure(error.message));
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(types.FETCH_MOVIES_REQUEST, fetchMoviesSaga),
    takeLatest(types.FETCH_MOVIE_DETAILS_REQUEST, fetchMovieDetailsSaga),
    debounce(SEARCH_DEBOUNCE_MS, types.SEARCH_MOVIES_REQUEST, searchMoviesSaga),
  ]);
}
