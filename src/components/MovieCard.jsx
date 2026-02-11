import React from 'react';
import { IMAGE_BASE_URL, POSTER_SIZE } from '../constants';
import './MovieCard.css';
import {useNavigate} from "react-router-dom";

const MovieCard = React.memo(React.forwardRef(({ movie, isFocused }, ref) => {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${movie.poster_path}`
    : '/placeholder.png';
  const navigate = useNavigate();

  return (
    <div
      ref={ref}
      className={`movie-card ${isFocused ? 'focused' : ''}`}
      data-movie-id={movie.id}
    >
      <div className="movie-card-poster" onClick={()=>navigate(`/movie/${movie.id}`)}>
        <img
          src={posterUrl}
          alt={movie.title}
          onError={(e) => {
            e.target.src = '/placeholder.png';
          }}
        />
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <div className="movie-card-meta">
          <span className="movie-card-year">
            {movie.release_date?.split('-')[0] || 'N/A'}
          </span>
          {movie.vote_average > 0 && (
            <span className="movie-card-rating">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}));

MovieCard.displayName = 'MovieCard';

export default MovieCard;
