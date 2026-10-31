import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiSearch } from 'react-icons/fi'
import books from '../data/books'

function Home() {
  const navigate = useNavigate()
  const categories = [...new Set(books.map((book) => book.category))]

  return (
    <main className="cg-page cg-home">
      <section className="cg-home-hero cg-page-header" aria-labelledby="home-title">
        <div className="cg-home-hero-copy">
          <p className="cg-eyebrow">La bibliothèque numérique congolaise</p>
          <h1 id="home-title">Des livres à lire, où que vous soyez.</h1>
          <p>Explorez les œuvres, les récits et les idées qui font vivre les littératures du Congo et d’Afrique.</p>
          <div className="cg-actions">
            <button className="cg-button cg-button-primary cg-primary-button" onClick={() => navigate('/explore')}>
              Explorer la bibliothèque <FiArrowRight aria-hidden="true" />
            </button>
            <button className="cg-button cg-button-secondary cg-secondary-button" onClick={() => navigate('/bibliotheque')}>
              Ma bibliothèque
            </button>
          </div>
        </div>
        <div className="cg-home-book" role="img" aria-label="Un livre de la bibliothèque Congolibs">
          <FiBookOpen aria-hidden="true" />
          <span>Lire et découvrir</span>
        </div>
      </section>

      <button className="cg-home-search cg-secondary-button" onClick={() => navigate('/recherche')} aria-label="Rechercher dans la bibliothèque">
        <FiSearch aria-hidden="true" />
        <span>Que souhaitez-vous lire ?</span>
        <span className="cg-home-search-action">Rechercher</span>
      </button>

      <section className="cg-section" aria-labelledby="home-categories">
        <div className="cg-section-heading">
          <div>
            <p className="cg-eyebrow">Parcourir</p>
            <h2 id="home-categories">Explorer les catégories</h2>
          </div>
          <button className="cg-text-button cg-text-link" onClick={() => navigate('/explore')}>
            Tout explorer <FiArrowRight aria-hidden="true" />
          </button>
        </div>
        <div className="cg-category-list">
          {categories.map((category) => (
            <button className="cg-category-card" key={category} onClick={() => navigate('/explore')}>
              <span>{category}</span>
              <FiArrowRight aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="cg-section" aria-labelledby="home-books">
        <div className="cg-section-heading">
          <div>
            <p className="cg-eyebrow">La collection</p>
            <h2 id="home-books">À découvrir</h2>
          </div>
          <button className="cg-text-button cg-text-link" onClick={() => navigate('/bibliotheque')}>
            Tous les livres <FiArrowRight aria-hidden="true" />
          </button>
        </div>
        <div className="cg-book-grid">
          {books.slice(0, 4).map((book) => (
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
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cg-home-invitation">
        <div>
          <p className="cg-eyebrow">Prenez le temps de lire</p>
          <h2>Une histoire vous attend.</h2>
          <p>Parcourez la collection et choisissez votre prochaine lecture.</p>
        </div>
        <button className="cg-button cg-button-primary cg-primary-button" onClick={() => navigate('/explore')}>
          Explorer <FiArrowRight aria-hidden="true" />
        </button>
      </section>
    </main>
  )
}

export default Home
