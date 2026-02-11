import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { searchMoviesRequest, clearSearch } from '../store/actions';
import { MIN_SEARCH_LENGTH } from '../constants';
import './SearchBar.css';

const SearchBar = React.memo(() => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchValue.length >= MIN_SEARCH_LENGTH) {
      dispatch(searchMoviesRequest(searchValue, 1));
    } else if (searchValue.length === 0) {
      dispatch(clearSearch());
    }
  }, [searchValue]);

  const handleChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setSearchValue('');
    dispatch(clearSearch());
    inputRef.current?.focus();
  }, [dispatch]);

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search movies..."
          value={searchValue}
          onChange={handleChange}
          autoComplete="off"
        />
        {searchValue && (
          <button className="search-clear" onClick={handleClear}>
            ✕
          </button>
        )}
      </div>
      {searchValue.length > 0 && searchValue.length < MIN_SEARCH_LENGTH && (
        <p className="search-hint">
          Type at least {MIN_SEARCH_LENGTH} characters to search
        </p>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
