import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  totalItems = 0,
  itemsPerPage = 10,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page if not visible
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          1
        </button>
      );

      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-3 py-2 text-sm text-gray-500">
            ...
          </span>
        );
      }
    }

    // Add visible page numbers
    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-2 text-sm ${
            page === currentPage
              ? 'bg-primary-600 text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {page}
        </button>
      );
    }

    // Add last page if not visible
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-3 py-2 text-sm text-gray-500">
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Info */}
      {showInfo && (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </button>

        {/* Page numbers */}
        <div className="hidden sm:flex">
          {renderPageNumbers()}
        </div>

        {/* Mobile page indicator */}
        <div className="flex items-center px-3 py-2 text-sm text-gray-700 sm:hidden dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;