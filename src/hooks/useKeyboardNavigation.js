import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  navigateUp,
  navigateDown,
  navigateLeft,
  navigateRight,
  setFocusedIndex,
  setCurrentPage,
  fetchMoviesRequest,
  searchMoviesRequest,
} from '../store/actions';
import { KEYS, ITEMS_PER_ROW, ITEMS_PER_PAGE } from '../constants';

export const useKeyboardNavigation = (items, onSelect) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const focusedIndex = useSelector((state) => state.navigation.focusedIndex);
  const currentPage = useSelector((state) => state.movies.currentPage);
  const totalPages = useSelector((state) => state.movies.totalPages);
  const activeFilter = useSelector((state) => state.movies.activeFilter);
  const searchQuery = useSelector((state) => state.movies.searchQuery);
  const isSearching = useSelector((state) => state.movies.isSearching);
  const itemRefs = useRef([]);

  // Ensure focusedIndex doesn't exceed items length
  useEffect(() => {
    if (focusedIndex >= items.length && items.length > 0) {
      dispatch(setFocusedIndex(items.length - 1));
    }
  }, [focusedIndex, items.length, dispatch]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex < ITEMS_PER_ROW) {
      // First row: scroll to top so search bar stays visible
      document.getElementById('root')?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [focusedIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent tab navigation
      if (event.key === KEYS.TAB) {
        event.preventDefault();
        return;
      }

      switch (event.key) {
        case KEYS.ARROW_UP:
          event.preventDefault();
          if (focusedIndex >= ITEMS_PER_ROW) {
            dispatch(navigateUp());
          } else if (currentPage > 1) {
            const newPage = currentPage - 1;
            const column = focusedIndex % ITEMS_PER_ROW;
            const lastRowStart = (Math.ceil(ITEMS_PER_PAGE / ITEMS_PER_ROW) - 1) * ITEMS_PER_ROW;
            dispatch(setFocusedIndex(lastRowStart + column));
            dispatch(setCurrentPage(newPage));
            if (isSearching && searchQuery) {
              dispatch(searchMoviesRequest(searchQuery, newPage));
            } else {
              dispatch(fetchMoviesRequest(activeFilter, newPage));
            }
          }
          break;

        case KEYS.ARROW_DOWN:
          event.preventDefault();
          if (focusedIndex + ITEMS_PER_ROW < items.length) {
            dispatch(navigateDown());
          } else if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            const column = focusedIndex % ITEMS_PER_ROW;
            dispatch(setFocusedIndex(column));
            dispatch(setCurrentPage(newPage));
            if (isSearching && searchQuery) {
              dispatch(searchMoviesRequest(searchQuery, newPage));
            } else {
              dispatch(fetchMoviesRequest(activeFilter, newPage));
            }
          }
          break;

        case KEYS.ARROW_LEFT:
          event.preventDefault();
          if (focusedIndex > 0) {
            dispatch(navigateLeft());
          }
          break;

        case KEYS.ARROW_RIGHT:
          event.preventDefault();
          if (focusedIndex < items.length - 1) {
            dispatch(navigateRight());
          }
          break;

        case KEYS.ENTER:
          event.preventDefault();
          if (items[focusedIndex] && onSelect) {
            onSelect(items[focusedIndex]);
          }
          break;

        case KEYS.ESCAPE:
          event.preventDefault();
          navigate(-1);
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, items, dispatch, navigate, onSelect, currentPage, totalPages, activeFilter, searchQuery, isSearching]);

  return { focusedIndex, itemRefs };
};
