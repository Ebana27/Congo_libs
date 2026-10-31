import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiBookOpen, FiSearch, FiStar, FiX } from 'react-icons/fi'
import books from '../data/books'

function Search() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const value = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!value) return []
    return books.filter((book) => {
      if (type === 'books') return book.title.toLowerCase().includes(value)
      if (type === 'authors') return book.author.toLowerCase().includes(value)
      return `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(value)
    })
  }, [value, type])

  return (
    <main className="cg-page cg-search-page">
      <header className="cg-page-heading cg-page-header cg-search-heading">
        <button className="cg-text-button cg-text-link" onClick={() => navigate(-1)}>
          <FiArrowLeft aria-hidden="true" /> Retour
        </button>
        <div>
          <p className="cg-eyebrow">Congolibs · Recherche</p>
          <h1>Que souhaitez-vous lire ?</h1>
          <p>Recherchez un livre, un auteur ou une catégorie.</p>
        </div>
      </header>

      <div className="cg-search-field cg-global-search">
        <FiSearch aria-hidden="true" />
        <label className="cg-visually-hidden" htmlFor="book-search">Rechercher dans la bibliothèque</label>
        <input id="book-search" className="cg-input" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Titre, auteur ou catégorie" />
        {query && (
          <button type="button" className="cg-icon-button" onClick={() => setQuery('')} aria-label="Effacer la recherche">
            <FiX aria-hidden="true" />
          </button>
        )}
      </div>

      <nav className="cg-filter-list" aria-label="Type de recherche">
        {[['all', 'Tout'], ['books', 'Livres'], ['authors', 'Auteurs']].map(([value, label]) => (
          <button type="button" key={value} className="cg-filter cg-filter-chip" aria-pressed={type === value} onClick={() => setType(value)}>{label}</button>
        ))}
      </nav>

      {!query ? (
        <section className="cg-empty-state cg-search-prompt">
          <FiSearch aria-hidden="true" />
          <h2>Commencez votre recherche</h2>
          <p>Saisissez un titre, un nom d’auteur ou une catégorie.</p>
          <div className="cg-search-suggestions" role="group" aria-label="Suggestions d’auteurs de la collection">
            <span>Dans la collection :</span>
            {[...new Set(books.map((book) => book.author))].slice(0, 3).map((author) => (
              <button type="button" key={author} className="cg-filter cg-filter-chip" onClick={() => setQuery(author)}>{author}</button>
            ))}
          </div>
        </section>
      ) : (
        <section className="cg-section" aria-labelledby="search-results">
          <div className="cg-section-heading">
            <div>
              <p className="cg-eyebrow">Résultats</p>
              <h2 id="search-results">Pour « {query} »</h2>
            </div>
            <span className="cg-result-count">{results.length} {results.length > 1 ? 'résultats' : 'résultat'}</span>
          </div>
          {results.length ? (
            <div className="cg-book-list">
              {results.map((book) => (
                <Link className="cg-book-list-card cg-book-card-link" key={book.id} to={`/livre/${book.id}`}>
                  <span className="cg-book-cover">
                    {book.cover ? <img src={book.cover} alt="" /> : (
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
                    <span className="cg-book-meta"><FiStar aria-hidden="true" /> {book.rating}/5 · {book.pages} pages <FiArrowRight aria-hidden="true" /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="cg-empty-state" role="status">
              <FiSearch aria-hidden="true" />
              <h3>Aucun résultat</h3>
              <p>Aucun livre ne correspond à cette recherche.</p>
              <button className="cg-button cg-button-secondary cg-secondary-button" onClick={() => setQuery('')}>Nouvelle recherche</button>
            </div>
          )}
        </section>
      )}
    </main>
  )
}

export default Search
