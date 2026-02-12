import React from 'react';
import { useSelector } from 'react-redux';
import { FILTER_TYPES } from '../constants';
import './Pagination.css';

const Pagination = React.memo(() => {
  const currentPage = useSelector((state) => state.movies.currentPage);
  const totalPages = useSelector((state) => state.movies.totalPages);
  const activeFilter = useSelector((state) => state.movies.activeFilter);

  if (activeFilter === FILTER_TYPES.FAVORITES) {
    return null;
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <span className="page-indicator">
      Page {currentPage} of {totalPages}
    </span>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
