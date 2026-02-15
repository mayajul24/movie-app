import React from 'react';
import { useSelector } from 'react-redux';
import MovieCard from './MovieCard';
import { SECTIONS } from '../constants';
import './MovieGrid.css';

const MovieGrid = React.memo(({ movies, focusedIndex, itemRefs }) => {
  const activeSection = useSelector((state) => state.navigation.activeSection);
  const isGridActive = activeSection === SECTIONS.GRID;

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
          isFocused={isGridActive && index === focusedIndex}
          ref={(el) => (itemRefs.current[index] = el)}
        />
      ))}
    </div>
  );
});

MovieGrid.displayName = 'MovieGrid';

export default MovieGrid;
