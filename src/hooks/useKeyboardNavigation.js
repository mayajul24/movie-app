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
  setActiveSection,
  setFocusedFilterIndex,
  setActiveFilter,
  fetchMoviesRequest,
  searchMoviesRequest,
} from '../store/actions';
import {
  KEYS, ITEMS_PER_ROW,
  SECTIONS, FILTER_ORDER,
} from '../constants';

const isOnFirstRow = (index) => index < ITEMS_PER_ROW;
const isOnLastRow = (index, totalItems) => index + ITEMS_PER_ROW >= totalItems;

export const useKeyboardNavigation = (items, onSelect) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemRefs = useRef([]);

  const activeSection = useSelector((state) => state.navigation.activeSection);
  const focusedIndex = useSelector((state) => state.navigation.focusedIndex);
  const focusedFilterIndex = useSelector((state) => state.navigation.focusedFilterIndex);
  const currentPage = useSelector((state) => state.movies.currentPage);
  const totalPages = useSelector((state) => state.movies.totalPages);
  const activeFilter = useSelector((state) => state.movies.activeFilter);
  const searchQuery = useSelector((state) => state.movies.searchQuery);
  const isSearching = useSelector((state) => state.movies.isSearching);
  const loading = useSelector((state) => state.movies.loading);

  const hasNextPage = currentPage < totalPages;

  const fetchPage = useCallback((page) => {
    dispatch(setCurrentPage(page));
    if (isSearching && searchQuery) {
      dispatch(searchMoviesRequest(searchQuery, page));
    } else {
      dispatch(fetchMoviesRequest(activeFilter, page));
    }
  }, [dispatch, isSearching, searchQuery, activeFilter]);

  const activateFilter = useCallback((filterType) => {
    dispatch(setActiveFilter(filterType));
    dispatch(fetchMoviesRequest(filterType, 1));
  }, [dispatch]);

  // Clamp focusedIndex when items shrink
  useEffect(() => {
    if (items.length > 0 && focusedIndex >= items.length) {
      dispatch(setFocusedIndex(items.length - 1));
    }
  }, [focusedIndex, items.length, dispatch]);

  // Scroll management based on active section
  useEffect(() => {
    if (activeSection === SECTIONS.SEARCH || activeSection === SECTIONS.FILTERS) {
      document.getElementById('root')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (activeSection === SECTIONS.PAGINATION) {
      return; // Pagination component handles its own scroll-into-view
    }
    if (isOnFirstRow(focusedIndex)) {
      document.getElementById('root')?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [focusedIndex, activeSection]);

  // Keyboard event handler
  useEffect(() => {
    const handleSearchKeys = (event) => {
      switch (event.key) {
        case KEYS.ARROW_DOWN:
          event.preventDefault();
          dispatch(setActiveSection(SECTIONS.FILTERS));
          break;
        case KEYS.ESCAPE:
          event.preventDefault();
          dispatch(setActiveSection(SECTIONS.GRID));
          break;
        default:
          break;
      }
    };

    const handleFilterKeys = (event) => {
      event.preventDefault();
      switch (event.key) {
        case KEYS.ARROW_UP:
          dispatch(setActiveSection(SECTIONS.SEARCH));
          break;
        case KEYS.ARROW_DOWN:
          dispatch(setActiveSection(SECTIONS.GRID));
          break;
        case KEYS.ARROW_LEFT:
          if (focusedFilterIndex > 0) {
            dispatch(setFocusedFilterIndex(focusedFilterIndex - 1));
          }
          break;
        case KEYS.ARROW_RIGHT:
          if (focusedFilterIndex < FILTER_ORDER.length - 1) {
            dispatch(setFocusedFilterIndex(focusedFilterIndex + 1));
          }
          break;
        case KEYS.ENTER:
          activateFilter(FILTER_ORDER[focusedFilterIndex]);
          break;
        case KEYS.ESCAPE:
          dispatch(setActiveSection(SECTIONS.GRID));
          break;
        default:
          break;
      }
    };

    const handleGridKeys = (event) => {
      event.preventDefault();
      switch (event.key) {
        case KEYS.ARROW_UP:
          if (!isOnFirstRow(focusedIndex)) {
            dispatch(navigateUp());
          } else {
            dispatch(setActiveSection(SECTIONS.FILTERS));
          }
          break;
        case KEYS.ARROW_DOWN:
          if (!isOnLastRow(focusedIndex, items.length)) {
            dispatch(navigateDown());
          } else if (hasNextPage) {
            dispatch(setActiveSection(SECTIONS.PAGINATION));
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

    const handlePaginationKeys = (event) => {
      event.preventDefault();
      switch (event.key) {
        case KEYS.ARROW_LEFT:
          if (!loading && currentPage > 1) {
            fetchPage(currentPage - 1);
            dispatch(setFocusedIndex(0));
            dispatch(setActiveSection(SECTIONS.GRID));
          }
          break;
        case KEYS.ARROW_RIGHT:
          if (!loading && hasNextPage) {
            fetchPage(currentPage + 1);
            dispatch(setFocusedIndex(0));
            dispatch(setActiveSection(SECTIONS.GRID));
          }
          break;
        case KEYS.ARROW_UP:
          dispatch(setActiveSection(SECTIONS.GRID));
          break;
        case KEYS.ESCAPE:
          dispatch(setActiveSection(SECTIONS.GRID));
          break;
        default:
          break;
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === KEYS.TAB) {
        event.preventDefault();
        return;
      }

      switch (activeSection) {
        case SECTIONS.SEARCH:
          handleSearchKeys(event);
          break;
        case SECTIONS.FILTERS:
          handleFilterKeys(event);
          break;
        case SECTIONS.GRID:
          handleGridKeys(event);
          break;
        case SECTIONS.PAGINATION:
          handlePaginationKeys(event);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeSection, focusedIndex, focusedFilterIndex,
    items, onSelect, dispatch, navigate,
    fetchPage, activateFilter, currentPage, hasNextPage, loading,
  ]);

  return { focusedIndex, itemRefs };
};
