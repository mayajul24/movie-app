import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMoviesRequest, loadFavorites } from '../store/actions';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movies = useSelector((state) => state.movies.movies);
  const activeFilter = useSelector((state) => state.movies.activeFilter);
  const loading = useSelector((state) => state.movies.loading);
  const error = useSelector((state) => state.movies.error);
  const currentPage = useSelector((state) => state.movies.currentPage);

  useEffect(() => {
    dispatch(loadFavorites());
    dispatch(fetchMoviesRequest(activeFilter, currentPage));
  }, [dispatch]);

  const handleMovieSelect = useCallback((movie) => {
    navigate(`/movie/${movie.id}`);
  }, [navigate]);

  const { focusedIndex, itemRefs } = useKeyboardNavigation(movies, handleMovieSelect);

  const handleRetry = useCallback(() => {
    dispatch(fetchMoviesRequest(activeFilter, currentPage));
  }, [dispatch, activeFilter, currentPage]);

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">🎬 Movie Browser</h1>
      </header>

      <div className="home-controls">
        <SearchBar />
        <FilterBar />
      </div>

      <main className="home-content">
        {loading && movies.length === 0 ? (
          <Loading />
        ) : error ? (
          <ErrorMessage message={error} onRetry={handleRetry} />
        ) : (
          <>
            <MovieGrid
              movies={movies}
              focusedIndex={focusedIndex}
              itemRefs={itemRefs}
            />
            <Pagination />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
