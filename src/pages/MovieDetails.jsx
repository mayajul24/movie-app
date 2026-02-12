import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMovieDetailsRequest,
  addToFavorites,
  removeFromFavorites,
} from '../store/actions';
import { IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE, KEYS } from '../constants';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './MovieDetails.css';

const DETAIL_BUTTONS = { BACK: 0, FAVORITE: 1 };

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [focusedButton, setFocusedButton] = useState(DETAIL_BUTTONS.BACK);

  const movie = useSelector((state) => state.movies.currentMovie);
  const loading = useSelector((state) => state.movies.loading);
  const error = useSelector((state) => state.movies.error);
  const favorites = useSelector((state) => state.favorites.favorites);

  const movieId = parseInt(id);
  const isFavorite = favorites.some((fav) => fav.id === movieId);

  useEffect(() => {
    dispatch(fetchMovieDetailsRequest(id));
  }, [dispatch, id]);

  const handleToggleFavorite = useCallback(() => {
    if (isFavorite) {
      dispatch(removeFromFavorites(movieId));
    } else if (movie) {
      dispatch(addToFavorites(movie));
    }
  }, [isFavorite, movieId, movie, dispatch]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleRetry = useCallback(() => {
    dispatch(fetchMovieDetailsRequest(id));
  }, [dispatch, id]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === KEYS.TAB) {
        event.preventDefault();
        return;
      }

      switch (event.key) {
        case KEYS.ARROW_UP:
        case KEYS.ARROW_LEFT:
          event.preventDefault();
          setFocusedButton(DETAIL_BUTTONS.BACK);
          break;
        case KEYS.ARROW_DOWN:
        case KEYS.ARROW_RIGHT:
          event.preventDefault();
          setFocusedButton(DETAIL_BUTTONS.FAVORITE);
          break;
        case KEYS.ENTER:
          event.preventDefault();
          if (focusedButton === DETAIL_BUTTONS.BACK) {
            handleBack();
          } else {
            handleToggleFavorite();
          }
          break;
        case KEYS.ESCAPE:
          event.preventDefault();
          handleBack();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedButton, handleBack, handleToggleFavorite]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  if (!movie) {
    return null;
  }

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_BASE_URL}/${BACKDROP_SIZE}${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${movie.poster_path}`
    : '/placeholder.png';

  const isBackFocused = focusedButton === DETAIL_BUTTONS.BACK;
  const isFavoriteFocused = focusedButton === DETAIL_BUTTONS.FAVORITE;

  const backClassName = `movie-details-back ${isBackFocused ? 'keyboard-focused' : ''}`;
  const favoriteClassName = [
    'movie-details-favorite',
    isFavorite && 'active',
    isFavoriteFocused && 'keyboard-focused',
  ].filter(Boolean).join(' ');

  return (
    <div className="movie-details">
      {backdropUrl && (
        <div
          className="movie-details-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}

      <div className="movie-details-content">
        <button className={backClassName} onClick={handleBack}>
          ← Back
        </button>

        <div className="movie-details-main">
          <div className="movie-details-poster">
            <img src={posterUrl} alt={movie.title} />
          </div>

          <div className="movie-details-info">
            <h1 className="movie-details-title">{movie.title}</h1>

            {movie.tagline && (
              <p className="movie-details-tagline">"{movie.tagline}"</p>
            )}

            <div className="movie-details-meta">
              {movie.release_date && (
                <span className="meta-item">
                  📅 {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="meta-item">⏱️ {movie.runtime} min</span>
              )}
              {movie.vote_average > 0 && (
                <span className="meta-item">
                  ⭐ {movie.vote_average.toFixed(1)}/10
                </span>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="movie-details-genres">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {movie.overview && (
              <div className="movie-details-overview">
                <h2>Overview</h2>
                <p>{movie.overview}</p>
              </div>
            )}

            <button className={favoriteClassName} onClick={handleToggleFavorite}>
              {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            </button>
          </div>
        </div>

        {movie.production_companies?.length > 0 && (
          <div className="movie-details-companies">
            <h3>Production Companies</h3>
            <div className="companies-list">
              {movie.production_companies.map((company) => (
                <span key={company.id} className="company-name">
                  {company.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;