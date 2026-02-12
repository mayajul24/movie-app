# Quick Setup Guide

## Step 1: Get TMDB API Key
1. Go to https://www.themoviedb.org/
2. Sign up for a free account
3. Go to Settings → API
4. Click "Request an API Key"
5. Fill in the required information
6. Copy your API Key (v3 auth)

## Step 2: Install Dependencies
```bash
npm install
```

## Step 3: Add Your API Key
Edit the file: `src/constants/index.js`

Find this line:
```javascript
export const API_KEY = 'YOUR_API_KEY_HERE';
```

Replace `YOUR_API_KEY_HERE` with your actual API key:
```javascript
export const API_KEY = 'your_actual_api_key_from_tmdb';
```

## Step 4: Run the App
```bash
npm run dev
```

Open your browser to: http://localhost:3000

## Keyboard Controls
- **↑ ↓ ← →** - Navigate movies
- **Enter** - Open movie details
- **Escape** - Go back

That's it! Enjoy browsing movies! 🎬
