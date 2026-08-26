import { useNavigate } from 'react-router-dom'
import {
  FiBookOpen,
  FiHeart,
  FiStar,
  FiArrowRight,
} from 'react-icons/fi'

function BookCard({ book }) {
  const navigate = useNavigate()

  return (
    <article
      className="book-card"
      onClick={() => navigate(`/livre/${book.id}`)}
    >
      <div className="book-cover">

        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
          />
        ) : (
          <div className="book-cover-placeholder">
            <FiBookOpen />

            <strong>{book.title}</strong>

            <span>{book.author}</span>
          </div>
        )}

        <button
          className="favorite-button"
          onClick={(event) => {
            event.stopPropagation()
          }}
          aria-label="Ajouter aux favoris"
        >
          <FiHeart />
        </button>

        <div className="book-read-button">
          Lire
          <FiArrowRight />
        </div>
      </div>

      <div className="book-info">

        <span className="book-category">
          {book.category}
        </span>

        <h3>
          {book.title}
        </h3>

        <p>
          {book.author}
        </p>

        <div className="book-meta">

          <span className="book-rating">
            <FiStar />
            {book.rating}
          </span>

          <span>
            {book.pages} pages
          </span>

        </div>
      </div>
    </article>
  )
}

export default BookCard