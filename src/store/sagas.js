import { call, put, takeLatest, debounce, select, all } from 'redux-saga/effects';
import * as types from './actionTypes';
import * as actions from './actions';
import * as api from '../services/api';
import { FILTER_TYPES, SEARCH_DEBOUNCE_MS, MIN_SEARCH_LENGTH } from '../constants';

// Selectors
const getFavorites = (state) => state.favorites.favorites;

function* fetchMoviesSaga(action) {
  try {
    const { filterType, page } = action.payload;
    let response;

    switch (filterType) {
      case FILTER_TYPES.POPULAR:
        response = yield call(api.fetchPopularMovies, page);
        break;
      case FILTER_TYPES.AIRING_NOW:
        response = yield call(api.fetchNowPlayingMovies, page);
        break;
      case FILTER_TYPES.FAVORITES:
        // Favorites are handled locally, no API call needed
        const favorites = yield select(getFavorites);
        yield put(
          actions.fetchMoviesSuccess(favorites, 1, filterType, 1)
        );
        return;
      default:
        throw new Error(`Unknown filter type: ${filterType}`);
    }

    yield put(
      actions.fetchMoviesSuccess(
        response.results,
        response.total_pages,
        filterType,
        page
      )
    );
  } catch (error) {
    const errorMessage = error.message || 'Failed to fetch movies. Please check your API key.';
    yield put(actions.fetchMoviesFailure(errorMessage));
  }
}

function* fetchMovieDetailsSaga(action) {
  try {
    const { movieId } = action.payload;
    const movie = yield call(api.fetchMovieDetails, movieId);
    yield put(actions.fetchMovieDetailsSuccess(movie));
  } catch (error) {
    yield put(actions.fetchMovieDetailsFailure(error.message));
  }
}

function* searchMoviesSaga(action) {
  try {
    const { query, page } = action.payload;

    // Validate search query
    if (!query || query.length < MIN_SEARCH_LENGTH) {
      yield put(actions.clearSearch());
      return;
    }

    const response = yield call(api.searchMovies, query, page);
    yield put(
      actions.searchMoviesSuccess(
        response.results,
        response.total_pages,
        query,
        page
      )
    );
  } catch (error) {
    yield put(actions.searchMoviesFailure(error.message));
  }
}

function* watchFetchMovies() {
  yield takeLatest(types.FETCH_MOVIES_REQUEST, fetchMoviesSaga);
}

function* watchFetchMovieDetails() {
  yield takeLatest(types.FETCH_MOVIE_DETAILS_REQUEST, fetchMovieDetailsSaga);
}

function* watchSearchMovies() {
  yield debounce(SEARCH_DEBOUNCE_MS, types.SEARCH_MOVIES_REQUEST, searchMoviesSaga);
}

export default function* rootSaga() {
  yield all([
    watchFetchMovies(),
    watchFetchMovieDetails(),
    watchSearchMovies(),
  ]);
}
