import { useEffect, useRef, useCallback } from 'react';
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

const LAST_ROW_START = (Math.ceil(ITEMS_PER_PAGE / ITEMS_PER_ROW) - 1) * ITEMS_PER_ROW;

const isOnFirstRow = (index) => index < ITEMS_PER_ROW;
const isOnLastRow = (index, totalItems) => index + ITEMS_PER_ROW >= totalItems;
const getColumn = (index) => index % ITEMS_PER_ROW;

export const useKeyboardNavigation = (items, onSelect) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemRefs = useRef([]);

  const focusedIndex = useSelector((state) => state.navigation.focusedIndex);
  const currentPage = useSelector((state) => state.movies.currentPage);
  const totalPages = useSelector((state) => state.movies.totalPages);
  const activeFilter = useSelector((state) => state.movies.activeFilter);
  const searchQuery = useSelector((state) => state.movies.searchQuery);
  const isSearching = useSelector((state) => state.movies.isSearching);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const fetchPage = useCallback((page) => {
    dispatch(setCurrentPage(page));

    if (isSearching && searchQuery) {
      dispatch(searchMoviesRequest(searchQuery, page));
    } else {
      dispatch(fetchMoviesRequest(activeFilter, page));
    }
  }, [dispatch, isSearching, searchQuery, activeFilter]);

  // Clamp focusedIndex when items shrink (e.g. last page has fewer results)
  useEffect(() => {
    if (focusedIndex >= items.length && items.length > 0) {
      dispatch(setFocusedIndex(items.length - 1));
    }
  }, [focusedIndex, items.length, dispatch]);

  // Scroll focused item into view
  useEffect(() => {
    if (isOnFirstRow(focusedIndex)) {
      document.getElementById('root')?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [focusedIndex]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === KEYS.TAB) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      switch (event.key) {
        case KEYS.ARROW_UP:
          if (!isOnFirstRow(focusedIndex)) {
            dispatch(navigateUp());
          } else if (hasPreviousPage) {
            dispatch(setFocusedIndex(LAST_ROW_START + getColumn(focusedIndex)));
            fetchPage(currentPage - 1);
          }
          break;

        case KEYS.ARROW_DOWN:
          if (!isOnLastRow(focusedIndex, items.length)) {
            dispatch(navigateDown());
          } else if (hasNextPage) {
            dispatch(setFocusedIndex(getColumn(focusedIndex)));
            fetchPage(currentPage + 1);
          }
          break;

        case KEYS.ARROW_LEFT:
          if (focusedIndex > 0) {
            dispatch(navigateLeft());
          }
          break;

        case KEYS.ARROW_RIGHT:
          if (focusedIndex < items.length - 1) {
            dispatch(navigateRight());
          }
          break;

        case KEYS.ENTER:
          if (items[focusedIndex] && onSelect) {
            onSelect(items[focusedIndex]);
          }
          break;

        case KEYS.ESCAPE:
          navigate(-1);
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    focusedIndex, items, onSelect,
    dispatch, navigate, fetchPage,
    currentPage, hasPreviousPage, hasNextPage,
  ]);

  return { focusedIndex, itemRefs };
};
