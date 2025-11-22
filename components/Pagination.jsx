// Component Pagination
function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="pagination">
            <button
                className="btn btn-secondary"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Trước
            </button>
            <span className="pagination-info">
                Trang {currentPage} / {totalPages}
            </span>
            <button
                className="btn btn-secondary"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Sau
            </button>
        </div>
    );
}

