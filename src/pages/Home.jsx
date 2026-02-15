import React, { useEffect, useCallback, useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchMoviesRequest,
    loadFavorites,
    setFocusedIndex, // הוספנו את ה-action הזה
    setActiveSection
} from '../store/actions';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { SECTIONS } from '../constants';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './Home.css';

const SCROLL_KEY = 'homeScrollTop';
const FOCUS_KEY = 'homeFocusedIndex';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const movies = useSelector((state) => state.movies.movies);
    const activeFilter = useSelector((state) => state.movies.activeFilter);
    const loading = useSelector((state) => state.movies.loading);
    const error = useSelector((state) => state.movies.error);
    const currentPage = useSelector((state) => state.movies.currentPage);
    const focusedIndexFromRedux = useSelector((state) => state.navigation.focusedIndex);

    useEffect(() => {
        dispatch(loadFavorites());
        dispatch(fetchMoviesRequest(activeFilter, currentPage));
    }, [dispatch, activeFilter, currentPage]);

    // פונקציית בחירת סרט ששומרת את המיקום והאינדקס
    const handleMovieSelect = useCallback((movie) => {
        const rootElement = document.getElementById('root');
        // שומרים את מיקום הגלילה הנוכחי
        sessionStorage.setItem(SCROLL_KEY, String(rootElement?.scrollTop ?? 0));
        // שומרים את האינדקס של הסרט שבו אנו נמצאים
        sessionStorage.setItem(FOCUS_KEY, String(focusedIndexFromRedux));

        navigate(`/movie/${movie.id}`);
    }, [navigate, focusedIndexFromRedux]);

    const { focusedIndex, itemRefs } = useKeyboardNavigation(movies, handleMovieSelect);

    // אפקט לשחזור הגלילה והפוקוס
    const scrollRestoredRef = useRef(false);
    useLayoutEffect(() => {
        // מריצים את השחזור רק כשיש סרטים והטעינה הסתיימה
        if (loading || movies.length === 0 || scrollRestoredRef.current) return;

        const savedScroll = sessionStorage.getItem(SCROLL_KEY);
        const savedIndex = sessionStorage.getItem(FOCUS_KEY);

        if (savedScroll || savedIndex) {
            // משתמשים ב-requestAnimationFrame כדי לוודא שה-DOM מרונדר
            requestAnimationFrame(() => {
                const rootElement = document.getElementById('root');

                // 1. שחזור הגלילה
                if (savedScroll && rootElement) {
                    rootElement.scrollTo(0, parseInt(savedScroll, 10));
                }

                // 2. שחזור הפוקוס ב-Redux ובאלמנט הפיזי
                if (savedIndex !== null) {
                    const index = parseInt(savedIndex, 10);
                    dispatch(setFocusedIndex(index));
                    dispatch(setActiveSection(SECTIONS.GRID));

                    // נותנים פוקוס פיזי לאלמנט כדי שהמקלדת תמשיך ממנו
                    if (itemRefs.current[index]) {
                        itemRefs.current[index].focus();
                    }
                }

                scrollRestoredRef.current = true;
                // מנקים את המפתחות לאחר השחזור
                sessionStorage.removeItem(SCROLL_KEY);
                sessionStorage.removeItem(FOCUS_KEY);
            });
        }
    }, [loading, movies, dispatch, itemRefs]);

    const handleRetry = useCallback(() => {
        dispatch(fetchMoviesRequest(activeFilter, currentPage));
    }, [dispatch, activeFilter, currentPage]);

    return (
        <div className="home">
            <header className="home-header">
                <h1 className="home-title">🎬 Movie Browser</h1>
            </header>

            <div className="home-controls">
                <SearchBar />
                <FilterBar />
            </div>

            <main className="home-content">
                {loading && movies.length === 0 ? (
                    <Loading />
                ) : error ? (
                    <ErrorMessage message={error} onRetry={handleRetry} />
                ) : (
                    <>
                        <MovieGrid
                            movies={movies}
                            focusedIndex={focusedIndex}
                            itemRefs={itemRefs}
                        />
                        <Pagination />
                        {loading && movies.length > 0 && <Loading overlay />}
                    </>
                )}
            </main>
        </div>
    );
};

export default Home;