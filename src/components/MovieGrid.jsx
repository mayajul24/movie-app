import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import MovieCard from './MovieCard';
import './MovieGrid.css';

const MovieGrid = React.memo(({ movies }) => {
  const navigate = useNavigate();

  const handleMovieSelect = useCallback((movie) => {
    navigate(`/movie/${movie.id}`);
  }, [navigate]);

  const { focusedIndex, itemRefs } = useKeyboardNavigation(movies, handleMovieSelect);

  if (!movies || movies.length === 0) {
    return (
      <div className="movie-grid-empty">
        <p>No movies found</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFocused={index === focusedIndex}
          ref={(el) => (itemRefs.current[index] = el)}
        />
      ))}
    </div>
  );
});

MovieGrid.displayName = 'MovieGrid';

export default MovieGrid;
