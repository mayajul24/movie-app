import axios from 'axios';
import {
  API_BASE_URL,
  API_KEY,
  MAX_REQUESTS_PER_WINDOW,
  RATE_LIMIT_WINDOW_MS,
} from '../constants';

const API_TIMEOUT_MS = 10000;

const ERROR_MESSAGES = {
  timeout: 'Request timeout. Please try again.',
  network: 'Network error. Please check your connection.',
  401: 'Invalid API key. Please add your TMDB API key to your .env file.',
  404: 'Resource not found.',
  429: 'Too many requests. Please wait a moment.',
  default: 'An error occurred. Please try again.',
};

class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requestTimestamps = [];
  }

  async waitForSlot() {
    const now = Date.now();

    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (this.requestTimestamps.length >= this.maxRequests) {
      const oldestTimestamp = this.requestTimestamps[0];
      const waitTime = this.windowMs - (now - oldestTimestamp);

      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return this.waitForSlot();
      }
    }

    this.requestTimestamps.push(Date.now());
  }
}

const rateLimiter = new RateLimiter(MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  params: { api_key: API_KEY },
});

apiClient.interceptors.request.use(async (config) => {
  await rateLimiter.waitForSlot();
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error(ERROR_MESSAGES.timeout));
    }

    if (!error.response) {
      return Promise.reject(new Error(ERROR_MESSAGES.network));
    }

    const { status, data } = error.response;
    const message = ERROR_MESSAGES[status] || data?.status_message || ERROR_MESSAGES.default;
    return Promise.reject(new Error(message));
  }
);

export const fetchPopularMovies = async (page = 1) => {
  const response = await apiClient.get('/movie/popular', { params: { page } });
  return response.data;
};

export const fetchNowPlayingMovies = async (page = 1) => {
  const response = await apiClient.get('/movie/now_playing', { params: { page } });
  return response.data;
};

export const searchMovies = async (query, page = 1) => {
  const response = await apiClient.get('/search/movie', { params: { query, page } });
  return response.data;
};

export const fetchMovieDetails = async (movieId) => {
  const response = await apiClient.get(`/movie/${movieId}`);
  return response.data;
};

export default apiClient;
