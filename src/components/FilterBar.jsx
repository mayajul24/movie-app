import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveFilter, fetchMoviesRequest } from '../store/actions';
import { FILTER_TYPES, CATEGORY_FOCUS_DELAY_MS } from '../constants';
import './FilterBar.css';

const FilterBar = React.memo(() => {
  const dispatch = useDispatch();
  const activeFilter = useSelector((state) => state.movies.activeFilter);
  const [focusedFilter, setFocusedFilter] = useState(null);
  const focusTimerRef = useRef(null);

  const filters = useMemo(() => [
    { type: FILTER_TYPES.POPULAR, label: 'Popular' },
    { type: FILTER_TYPES.AIRING_NOW, label: 'Airing Now' },
    { type: FILTER_TYPES.FAVORITES, label: 'My Favorites' },
  ], []);

  useEffect(() => {
    return () => {
      if (focusTimerRef.current) {
        clearTimeout(focusTimerRef.current);
      }
    };
  }, []);

  const handleFilterClick = useCallback((filterType) => {
    if (focusTimerRef.current) {
      clearTimeout(focusTimerRef.current);
      focusTimerRef.current = null;
    }
    dispatch(setActiveFilter(filterType));
    dispatch(fetchMoviesRequest(filterType, 1));
  }, [dispatch]);

  const handleFilterFocus = useCallback((filterType) => {
    setFocusedFilter(filterType);
    if (focusTimerRef.current) {
      clearTimeout(focusTimerRef.current);
    }
    focusTimerRef.current = setTimeout(() => {
      dispatch(setActiveFilter(filterType));
      dispatch(fetchMoviesRequest(filterType, 1));
    }, CATEGORY_FOCUS_DELAY_MS);
  }, [dispatch]);

  const handleFilterBlur = useCallback(() => {
    setFocusedFilter(null);
    if (focusTimerRef.current) {
      clearTimeout(focusTimerRef.current);
      focusTimerRef.current = null;
    }
  }, []);

  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <button
          key={filter.type}
          className={`filter-button ${
            activeFilter === filter.type ? 'active' : ''
          } ${focusedFilter === filter.type ? 'focused' : ''}`}
          onClick={() => handleFilterClick(filter.type)}
          onFocus={() => handleFilterFocus(filter.type)}
          onBlur={handleFilterBlur}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
});

FilterBar.displayName = 'FilterBar';

export default FilterBar;
