# Movie Browser App

A React-based movie browsing application built with Redux-Saga that displays movies from The Movie Database (TMDB) API.

## Features

- ✅ Display popular movies and currently airing movies
- ✅ Search functionality with debouncing (500ms) and minimum 2 characters
- ✅ Filter by Popular, Airing Now, and My Favorites
- ✅ Full keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Pagination for Popular and Airing Now categories
- ✅ Detailed movie information page
- ✅ Add/remove movies to/from favorites (localStorage)
- ✅ Rate limiting (5 requests per 10 seconds)
- ✅ 4 cards per row grid layout
- ✅ Disabled mouse scrolling (keyboard-only scrolling)
- ✅ Tab key disabled for navigation
- ✅ Category focus delay (2 seconds) with immediate click response
- ✅ Comprehensive error handling

## Tech Stack

- **React** - UI framework
- **Redux** - State management
- **Redux-Saga** - Side effects management
- **React Router** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API Key

## Getting Started

### 1. Get TMDB API Key

1. Go to [The Movie Database](https://www.themoviedb.org/)
2. Create a free account
3. Navigate to Settings → API
4. Request an API key
5. Copy your API key

### 2. Install Dependencies

```bash
cd movie-app
npm install
```

### 3. Configure API Key

Open `src/constants/index.js` and replace `YOUR_API_KEY_HERE` with your actual TMDB API key:

```javascript
export const API_KEY = 'your_actual_api_key_here';
```

### 4. Run the Application

```bash
npm run dev
```

The application will start at `http://localhost:3000`

## Keyboard Controls

- **Arrow Keys** - Navigate between movies
- **Enter** - Select a movie (opens details page)
- **Escape** - Go back to previous page
- **Tab** - Disabled (does nothing)

## Project Structure

```
movie-app/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ErrorMessage.jsx
│   │   ├── FilterBar.jsx
│   │   ├── Loading.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieGrid.jsx
│   │   ├── Pagination.jsx
│   │   └── SearchBar.jsx
│   ├── hooks/               # Custom React hooks
│   │   └── useKeyboardNavigation.js
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   └── MovieDetails.jsx
│   ├── services/            # API services
│   │   └── api.js
│   ├── store/               # Redux store
│   │   ├── reducers/
│   │   ├── actionTypes.js
│   │   ├── actions.js
│   │   ├── sagas.js
│   │   └── index.js
│   ├── constants/           # App constants
│   │   └── index.js
│   ├── App.jsx              # Main App component
│   ├── App.css              # Global styles
│   └── main.jsx             # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Key Implementation Details

### Rate Limiting

The application implements a custom rate limiter that ensures no more than 5 API requests are made within a 10-second window. The limiter automatically queues requests and waits if the limit is exceeded.

### Search Debouncing

Search requests are debounced using Redux-Saga's `debounce` effect, ensuring requests are only sent after the user stops typing for 500ms.

### Keyboard Navigation

Custom hook `useKeyboardNavigation` manages focus state and handles keyboard events for navigating through the movie grid.

### Category Focus Behavior

- **Focus**: Triggers API request after 2 seconds
- **Click**: Immediately triggers API request

### Disabled Features

- Mouse wheel scrolling (only keyboard scrolling works)
- Tab key navigation
- Default browser scrollbars (hidden but scrolling works)

### Error Handling

- Network timeouts
- API errors (401, 404, 429, etc.)
- Missing/invalid data
- localStorage errors

## Code Quality

The project follows best practices including:

- Clear naming conventions
- Separation of concerns
- Reusable components
- Centralized state management
- Proper error handling
- Performance optimization (debouncing, rate limiting)
- Minimal re-renders
- Efficient API data loading

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Troubleshooting

**Issue**: Movies not loading
- Check your API key is correctly set in `src/constants/index.js`
- Check browser console for error messages
- Verify your internet connection

**Issue**: Keyboard navigation not working
- Ensure you're focused on the page (click anywhere on the page)
- Check browser console for errors

**Issue**: Rate limit errors
- Wait 10 seconds before trying again
- The app automatically handles rate limiting

## License

This project is for educational purposes as part of a technical assessment.
# movies-app
