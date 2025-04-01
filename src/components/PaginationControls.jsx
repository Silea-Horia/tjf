import React from 'react';

const PaginationControls = ({
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
}) => (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', alignItems: 'center' }}>
    <label htmlFor="itemsPerPage" style={{ marginRight: '10px' }}>Items per page:</label>
    <select
      id="itemsPerPage"
      value={itemsPerPage}
      onChange={(e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
      }}
      style={{ marginRight: '20px', padding: '5px' }}
    >
      {[5, 10, 15, 20].map((value) => (
        <option key={value} value={value}>{value}</option>
      ))}
    </select>
    {totalPages > 1 && (
      <>
        <button
          className="button"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px', alignSelf: 'center' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="button"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </>
    )}
  </div>
);

export default PaginationControls;