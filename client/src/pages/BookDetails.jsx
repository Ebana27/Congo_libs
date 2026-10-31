import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiBookOpen, FiStar } from 'react-icons/fi'
import books from '../data/books'

function BookDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const book = books.find((item) => item.id === Number(id))

  if (!book) {
    return (
      <main className="cg-page cg-book-not-found">
        <div className="cg-empty-state" role="status">
          <FiBookOpen aria-hidden="true" />
          <h1>Livre introuvable</h1>
          <p>Le livre demandé n’est pas disponible dans la collection.</p>
          <button className="cg-button cg-button-primary cg-primary-button" onClick={() => navigate('/bibliotheque')}>
            <FiArrowLeft aria-hidden="true" /> Retour à la bibliothèque
          </button>
        </div>
      </main>
    )
  }

  const relatedBooks = books.filter((item) => item.id !== book.id && item.category === book.category)

  return (
    <main className="cg-page cg-book-details">
      <button className="cg-text-button cg-text-link" onClick={() => navigate('/bibliotheque')}>
        <FiArrowLeft aria-hidden="true" /> Retour à la bibliothèque
      </button>

      <section className="cg-book-detail-main" aria-labelledby="book-title">
        <div className="cg-book-detail-cover">
          {book.cover ? <img src={book.cover} alt={`Couverture de ${book.title}`} /> : (
            <div className="cg-book-cover cg-book-cover-large">
              <div className="cg-book-cover-placeholder">
                <span className="cg-book-cover-mark"><FiBookOpen aria-hidden="true" /></span>
                <span className="cg-book-cover-category">{book.category}</span>
                <strong>{book.title}</strong>
                <span className="cg-book-cover-author">{book.author}</span>
              </div>
            </div>
          )}
        </div>
        <div className="cg-book-detail-copy">
          <p className="cg-eyebrow">{book.category}</p>
          <h1 id="book-title">{book.title}</h1>
          <p className="cg-book-detail-author">Par <strong>{book.author}</strong></p>
          <p className="cg-book-detail-rating"><FiStar aria-hidden="true" /> Note : {book.rating}/5</p>
          <dl className="cg-book-facts">
            <div><dt>Pages</dt><dd>{book.pages}</dd></div>
            <div><dt>Catégorie</dt><dd>{book.category}</dd></div>
            <div><dt>Auteur</dt><dd>{book.author}</dd></div>
          </dl>
          <button className="cg-button cg-button-primary cg-primary-button" onClick={() => navigate(`/lecteur/${book.id}`)}>
            <FiBookOpen aria-hidden="true" /> Lire maintenant
          </button>
        </div>
      </section>

      {relatedBooks.length > 0 && (
        <section className="cg-section" aria-labelledby="related-books">
          <div className="cg-section-heading">
            <div><p className="cg-eyebrow">Même catégorie</p><h2 id="related-books">À découvrir aussi</h2></div>
          </div>
          <div className="cg-book-grid">
            {relatedBooks.slice(0, 3).map((item) => (
              <Link className="cg-book-card cg-book-card-link" key={item.id} to={`/livre/${item.id}`}>
                <span className="cg-book-cover">
                  {item.cover ? <img src={item.cover} alt="" /> : (
                    <span className="cg-book-cover-placeholder">
                      <span className="cg-book-cover-mark"><FiBookOpen aria-hidden="true" /></span>
                      <span className="cg-book-cover-category">{item.category}</span>
                      <strong>{item.title}</strong>
                      <span className="cg-book-cover-author">{item.author}</span>
                    </span>
                  )}
                </span>
                <div className="cg-book-info">
                  <span className="cg-book-category">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.author}</p>
                  <span className="cg-book-meta">Voir le livre <FiArrowRight aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default BookDetails
