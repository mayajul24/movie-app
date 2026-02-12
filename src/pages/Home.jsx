import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesRequest, loadFavorites } from '../store/actions';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies.movies);
  const activeFilter = useSelector((state) => state.movies.activeFilter);
  const loading = useSelector((state) => state.movies.loading);
  const error = useSelector((state) => state.movies.error);
  const currentPage = useSelector((state) => state.movies.currentPage);

  useEffect(() => {
    dispatch(loadFavorites());
    dispatch(fetchMoviesRequest(activeFilter, currentPage));
  }, [dispatch]);

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
        <div className="home-controls-row">
          <FilterBar />
          <Pagination />
        </div>
      </div>

      <main className="home-content">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage message={error} onRetry={handleRetry} />
        ) : (
          <MovieGrid movies={movies} />
        )}
      </main>
    </div>
  );
};

export default Home;
