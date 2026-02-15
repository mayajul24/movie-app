import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveFilter, fetchMoviesRequest } from '../store/actions';
import { FILTER_TYPES, FILTER_ORDER, CATEGORY_FOCUS_DELAY_MS, SECTIONS } from '../constants';
import './FilterBar.css';

const FILTER_LABELS = {
  [FILTER_TYPES.POPULAR]: 'Popular',
  [FILTER_TYPES.AIRING_NOW]: 'Airing Now',
  [FILTER_TYPES.FAVORITES]: 'My Favorites',
};

const FilterBar = React.memo(() => {
  const dispatch = useDispatch();
  const activeFilter = useSelector((state) => state.movies.activeFilter);
  const activeSection = useSelector((state) => state.navigation.activeSection);
  const focusedFilterIndex = useSelector((state) => state.navigation.focusedFilterIndex);
  const focusTimerRef = useRef(null);

  const isFiltersActive = activeSection === SECTIONS.FILTERS;

  const clearTimer = useCallback(() => {
    if (focusTimerRef.current) {
      clearTimeout(focusTimerRef.current);
      focusTimerRef.current = null;
    }
  }, []);

  // Clean up timer on unmount
  useEffect(() => clearTimer, [clearTimer]);

  // Start 2-second timer when keyboard focus changes a filter
  useEffect(() => {
    clearTimer();

    if (isFiltersActive) {
      const filterType = FILTER_ORDER[focusedFilterIndex];
      focusTimerRef.current = setTimeout(() => {
        dispatch(setActiveFilter(filterType));
        dispatch(fetchMoviesRequest(filterType, 1));
      }, CATEGORY_FOCUS_DELAY_MS);
    }
  }, [isFiltersActive, focusedFilterIndex, dispatch, clearTimer]);

  const handleFilterClick = useCallback((filterType) => {
    clearTimer();
    dispatch(setActiveFilter(filterType));
    dispatch(fetchMoviesRequest(filterType, 1));
  }, [dispatch, clearTimer]);

  return (
    <div className="filter-bar">
      {FILTER_ORDER.map((filterType, index) => {
        const className = [
          'filter-button',
          activeFilter === filterType && 'active',
          isFiltersActive && focusedFilterIndex === index && 'focused',
        ].filter(Boolean).join(' ');

        return (
          <button
            key={filterType}
            className={className}
            onClick={() => handleFilterClick(filterType)}
          >
            {FILTER_LABELS[filterType]}
          </button>
        );
      })}
    </div>
  );
});

FilterBar.displayName = 'FilterBar';

export default FilterBar;
