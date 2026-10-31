import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiSearch } from 'react-icons/fi'
import books from '../data/books'

function Explore() {
  const navigate = useNavigate()
  const categories = [...new Set(books.map((book) => book.category))]

  return (
    <main className="cg-page cg-explore">
      <header className="cg-page-heading cg-page-header cg-explore-heading">
        <div>
          <p className="cg-eyebrow">Congolibs · Explorer</p>
          <h1>Une bibliothèque de récits et de savoirs.</h1>
          <p>Découvrez les œuvres et les auteurs de la collection.</p>
        </div>
        <button className="cg-button cg-button-secondary cg-secondary-button" onClick={() => navigate('/recherche')}>
          <FiSearch aria-hidden="true" /> Rechercher
        </button>
      </header>

      <section className="cg-section" aria-labelledby="explore-categories">
        <div className="cg-section-heading">
          <div>
            <p className="cg-eyebrow">Parcours de lecture</p>
            <h2 id="explore-categories">Explorer par catégorie</h2>
          </div>
        </div>
        <div className="cg-category-list">
          {categories.map((category) => {
            const count = books.filter((book) => book.category === category).length
            return (
              <button className="cg-category-card" key={category} onClick={() => navigate('/bibliotheque')}>
                <span><strong>{category}</strong><small>{count} {count > 1 ? 'livres' : 'livre'}</small></span>
                <FiArrowRight aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </section>

      <section className="cg-section" aria-labelledby="explore-collection">
        <div className="cg-section-heading">
          <div>
            <p className="cg-eyebrow">La collection</p>
            <h2 id="explore-collection">Livres à découvrir</h2>
          </div>
          <button className="cg-text-button cg-text-link" onClick={() => navigate('/bibliotheque')}>
            Tous les livres <FiArrowRight aria-hidden="true" />
          </button>
        </div>
        {books.length ? (
          <div className="cg-book-grid">
            {books.slice(0, 6).map((book) => (
              <Link className="cg-book-card cg-book-card-link" key={book.id} to={`/livre/${book.id}`}>
                <span className="cg-book-cover">
                  {book.cover
                    ? <img src={book.cover} alt="" />
                  : (
                    <span className="cg-book-cover-placeholder">
                      <span className="cg-book-cover-mark"><FiBookOpen aria-hidden="true" /></span>
                      <span className="cg-book-cover-category">{book.category}</span>
                      <strong>{book.title}</strong>
                      <span className="cg-book-cover-author">{book.author}</span>
                    </span>
                  )}
                </span>
              <div className="cg-book-info">
                <span className="cg-book-category">{book.category}</span>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <span className="cg-book-meta">{book.pages} pages · Note {book.rating}/5</span>
              </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="cg-empty-state">Aucun livre n’est disponible pour le moment.</p>
        )}
      </section>
    </main>
  )
}

export default Explore
