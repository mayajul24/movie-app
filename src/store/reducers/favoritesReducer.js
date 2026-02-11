import * as types from '../actionTypes';
import { FAVORITES_STORAGE_KEY } from '../../constants';

const loadFavoritesFromStorage = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

const initialState = {
  favorites: [],
};

const favoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_FAVORITES:
      return {
        ...state,
        favorites: loadFavoritesFromStorage(),
      };

    case types.ADD_TO_FAVORITES: {
      const newFavorites = [...state.favorites, action.payload.movie];
      saveFavoritesToStorage(newFavorites);
      return {
        ...state,
        favorites: newFavorites,
      };
    }

    case types.REMOVE_FROM_FAVORITES: {
      const filteredFavorites = state.favorites.filter(
        (movie) => movie.id !== action.payload.movieId
      );
      saveFavoritesToStorage(filteredFavorites);
      return {
        ...state,
        favorites: filteredFavorites,
      };
    }

    default:
      return state;
  }
};

export default favoritesReducer;
