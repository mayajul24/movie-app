# Movie Browser App

A React-based movie browsing application built with Redux-Saga that displays movies from The Movie Database (TMDB) API.

Features:

-  Display popular movies and currently airing movies
-  Search functionality with debouncing (500ms) and minimum 2 characters
-  Filter by Popular, Airing Now, and My Favorites
-  Full keyboard navigation (Arrow keys, Enter, Escape)
-  Pagination for Popular and Airing Now categories
-  Detailed movie information page
-  Add/remove movies to/from favorites (localStorage)
-  Rate limiting (5 requests per 10 seconds)
-  4 cards per row grid layout
-  Disabled mouse scrolling (keyboard-only scrolling)
-  Tab key disabled for navigation
- Category focus delay (2 seconds) with immediate click response
-  Comprehensive error handling

