import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesRequest, searchMoviesRequest, setCurrentPage } from '../store/actions';
import { FILTER_TYPES } from '../constants';
import './Pagination.css';

const Pagination = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.movies.currentPage);
  const totalPages = useSelector((state) => state.movies.totalPages);
  const activeFilter = useSelector((state) => state.movies.activeFilter);
  const searchQuery = useSelector((state) => state.movies.searchQuery);
  const isSearching = useSelector((state) => state.movies.isSearching);

  // Don't show pagination for favorites
  if (activeFilter === FILTER_TYPES.FAVORITES) {
    return null;
  }

  // Don't show if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) {
      return;
    }

    dispatch(setCurrentPage(newPage));

    if (isSearching && searchQuery) {
      dispatch(searchMoviesRequest(searchQuery, newPage));
    } else {
      dispatch(fetchMoviesRequest(activeFilter, newPage));
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pagination-button"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis-start" className="pagination-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis-end" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="pagination-button"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-button pagination-arrow"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </button>
      {renderPageNumbers()}
      <button
        className="pagination-button pagination-arrow"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
