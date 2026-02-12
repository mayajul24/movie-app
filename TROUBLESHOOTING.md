# 🚨 Troubleshooting Guide

## App stuck on "Loading..."

### Most Common Cause: Missing API Key

**Problem**: You haven't added your TMDB API key yet.

**Solution**:
1. Get your API key from https://www.themoviedb.org/settings/api
2. Open `src/constants/index.js`
3. Replace this line:
   ```javascript
   export const API_KEY = 'YOUR_API_KEY_HERE';
   ```
   With your actual key:
   ```javascript
   export const API_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
   ```
4. Save the file
5. The app should auto-reload and work!

### How to Check What's Wrong

Open the browser console (F12 or Right Click → Inspect → Console) and look for errors:

**Error**: `Invalid API key`
- **Fix**: Add your TMDB API key in `src/constants/index.js`

**Error**: `Network error`
- **Fix**: Check your internet connection

**Error**: `Too many requests`
- **Fix**: Wait 10 seconds and try again

**Error**: `Request timeout`
- **Fix**: Check your internet connection or try again

### Still Not Working?

1. **Clear browser cache**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Restart dev server**: 
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again
3. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

### Console Logs to Look For

When the app is working correctly, you should see:
```
Fetching movies: popular page: 1
Making API request: /movie/popular
Movies fetched successfully: 20
```

If you see errors like:
```
API Error: ...
Error fetching movies: ...
```

Then check the specific error message for what to fix.

## Need Help?

Check these in order:
1. ✅ API key is added in `src/constants/index.js`
2. ✅ API key is valid (copied correctly from TMDB)
3. ✅ Internet connection is working
4. ✅ Browser console shows what error is happening
5. ✅ Dev server is running without errors

Good luck! 🎬
