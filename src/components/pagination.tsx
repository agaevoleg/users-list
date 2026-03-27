import './pagination.css';
type PaginationProps = {
  length: number,
  page: number,
  onChange: (page: number) => void
}

export const Pagination = ({ length, page, onChange} : PaginationProps) => {
  return (
  <div className="pagination">
    {Array.from({ length: length }, (_, i) => (
        <button
        key={i}
        onClick={() => onChange(i + 1)}
        className={`page-btn ${page === i + 1 ? "active" : ""}`}
        >
        {i + 1}
        </button>
    ))}
    </div>
  )
}
