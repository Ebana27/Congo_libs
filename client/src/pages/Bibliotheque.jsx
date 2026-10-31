import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiBookOpen, FiGrid, FiList, FiSearch, FiStar } from 'react-icons/fi'
import books from '../data/books'

function Bibliotheque() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tous')
  const [view, setView] = useState('grid')
  const categories = ['Tous', ...new Set(books.map((book) => book.category))]

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return books.filter((book) => {
      const matchesSearch = !query || `${book.title} ${book.author}`.toLowerCase().includes(query)
      return matchesSearch && (category === 'Tous' || book.category === category)
    })
  }, [search, category])

  return (
    <main className="cg-page cg-personal-library">
      <header className="cg-page-heading cg-page-header">
        <div>
          <p className="cg-eyebrow">Congolibs · Ma collection</p>
          <h1>Bibliothèque</h1>
          <p>Retrouvez les livres disponibles dans la bibliothèque numérique.</p>
        </div>
        <span className="cg-result-count">{filteredBooks.length} {filteredBooks.length > 1 ? 'livres' : 'livre'}</span>
      </header>

      <section className="cg-library-tools" aria-label="Recherche et affichage">
        <label className="cg-search-field">
          <FiSearch aria-hidden="true" />
          <span className="cg-visually-hidden">Rechercher un livre ou un auteur</span>
          <input className="cg-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un livre ou un auteur" />
        </label>
        <div className="cg-view-switch" aria-label="Mode d’affichage">
          <button type="button" className={view === 'grid' ? 'cg-icon-button cg-view-selected' : 'cg-icon-button'} aria-pressed={view === 'grid'} aria-label="Affichage en grille" onClick={() => setView('grid')}><FiGrid /></button>
          <button type="button" className={view === 'list' ? 'cg-icon-button cg-view-selected' : 'cg-icon-button'} aria-pressed={view === 'list'} aria-label="Affichage en liste" onClick={() => setView('list')}><FiList /></button>
        </div>
      </section>

      <nav className="cg-filter-list" aria-label="Filtrer par catégorie">
        {categories.map((item) => (
          <button type="button" key={item} className="cg-filter cg-filter-chip" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </nav>

      {filteredBooks.length ? (
        <section className={view === 'grid' ? 'cg-book-grid' : 'cg-book-list'} aria-label="Livres">
          {filteredBooks.map((book) => (
            <Link className={view === 'grid' ? 'cg-book-card cg-book-card-link' : 'cg-book-list-card cg-book-card-link'} key={book.id} to={`/livre/${book.id}`}>
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
                <span className="cg-book-meta"><FiStar aria-hidden="true" /> {book.rating}/5 · {book.pages} pages</span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <div className="cg-empty-state" role="status">
          <FiSearch aria-hidden="true" />
          <h2>Aucun livre trouvé</h2>
          <p>Aucun résultat ne correspond à votre recherche.</p>
          <button className="cg-button cg-button-secondary cg-secondary-button" onClick={() => { setSearch(''); setCategory('Tous') }}>Réinitialiser les filtres</button>
        </div>
      )}
    </main>
  )
}

export default Bibliotheque
