import axios from 'axios';
import {
  API_BASE_URL,
  API_KEY,
  MAX_REQUESTS_PER_WINDOW,
  RATE_LIMIT_WINDOW_MS,
} from '../constants';

class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requestTimestamps = [];
  }

  async waitForSlot() {
    const now = Date.now();
    
    // Remove timestamps outside the current window
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    // If we've reached the limit, wait until the oldest request expires
    if (this.requestTimestamps.length >= this.maxRequests) {
      const oldestTimestamp = this.requestTimestamps[0];
      const waitTime = this.windowMs - (now - oldestTimestamp);
      
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return this.waitForSlot(); // Recursively check again
      }
    }

    // Add current timestamp
    this.requestTimestamps.push(Date.now());
  }
}

const rateLimiter = new RateLimiter(MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_MS);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  params: {
    api_key: API_KEY,
  },
});

// Add rate limiting interceptor
apiClient.interceptors.request.use(async (config) => {
  await rateLimiter.waitForSlot();
  return config;
});

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        return Promise.reject(new Error('Invalid API key. Please add your TMDB API key to your .env file.'));
      case 404:
        return Promise.reject(new Error('Resource not found.'));
      case 429:
        return Promise.reject(new Error('Too many requests. Please wait a moment.'));
      default:
        return Promise.reject(
          new Error(data?.status_message || 'An error occurred. Please try again.')
        );
    }
  }
);

export const fetchPopularMovies = async (page = 1) => {
  const response = await apiClient.get('/movie/popular', {
    params: { page },
  });
  return response.data;
};

export const fetchNowPlayingMovies = async (page = 1) => {
  const response = await apiClient.get('/movie/now_playing', {
    params: { page },
  });
  return response.data;
};

export const searchMovies = async (query, page = 1) => {
  const response = await apiClient.get('/search/movie', {
    params: { query, page },
  });
  return response.data;
};

export const fetchMovieDetails = async (movieId) => {
  const response = await apiClient.get(`/movie/${movieId}`);
  return response.data;
};

export default apiClient;
