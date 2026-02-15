import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FILTER_TYPES, SECTIONS } from '../constants';
import './Pagination.css';

const Pagination = React.memo(() => {
  const currentPage = useSelector((state) => state.movies.currentPage);
  const totalPages = useSelector((state) => state.movies.totalPages);
  const activeFilter = useSelector((state) => state.movies.activeFilter);
  const activeSection = useSelector((state) => state.navigation.activeSection);
  const paginationRef = useRef(null);

  const isActive = activeSection === SECTIONS.PAGINATION;

  // Scroll pagination into view when focused or page changes
  useEffect(() => {
    if (isActive && paginationRef.current) {
      paginationRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isActive, currentPage]);

  if (activeFilter === FILTER_TYPES.FAVORITES || totalPages <= 1) {
    return null;
  }

  const className = [
    'pagination',
    isActive && 'pagination-focused',
  ].filter(Boolean).join(' ');

  return (
    <div ref={paginationRef} className={className}>
      <span className="pagination-arrow-hint">{currentPage > 1 ? '←' : ''}</span>
      <span className="pagination-info">Page {currentPage} of {totalPages}</span>
      <span className="pagination-arrow-hint">{currentPage < totalPages ? '→' : ''}</span>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
