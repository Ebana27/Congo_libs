import { Link } from 'react-router-dom'
import {
  FiBookOpen,
} from 'react-icons/fi'

function BookCard({ book }) {
  return (
    <article className="book-card cg-book-card">
      <Link
        className="cg-book-card-link"
        to={`/livre/${book.id}`}
        aria-label={`${book.title}, de ${book.author}`}
      >
        <div className="book-cover cg-book-cover">
          {book.cover ? (
            <img src={book.cover} alt="" loading="lazy" />
          ) : (
            <div className="book-cover-placeholder cg-book-cover-placeholder">
              <span className="cg-book-cover-mark" aria-hidden="true">
                <FiBookOpen />
              </span>
              <span className="cg-book-cover-category">{book.category}</span>
              <strong>{book.title}</strong>
              <span className="cg-book-cover-author">{book.author}</span>
            </div>
          )}
        </div>

        <div className="book-info cg-book-info">
          <span className="book-category">{book.category}</span>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
        </div>
      </Link>
    </article>
  )
}

export default BookCard