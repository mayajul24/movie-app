import { combineReducers } from 'redux';
import moviesReducer from './moviesReducer';
import favoritesReducer from './favoritesReducer';
import navigationReducer from './navigationReducer';

const rootReducer = combineReducers({
  movies: moviesReducer,
  favorites: favoritesReducer,
  navigation: navigationReducer,
});

export default rootReducer;
