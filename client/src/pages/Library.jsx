import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiGrid, FiList, FiSearch, FiSliders } from 'react-icons/fi'
import books from '../data/books'

function Library() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tous')
  const [sort, setSort] = useState('popular')
  const [view, setView] = useState('grid')
  const categories = ['Tous', ...new Set(books.map((book) => book.category))]

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase()
    const result = books.filter((book) => {
      const matchesSearch = !query || `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query)
      return matchesSearch && (category === 'Tous' || book.category === category)
    })
    if (sort === 'popular') result.sort((a, b) => b.rating - a.rating)
    if (sort === 'title') result.sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'pages') result.sort((a, b) => b.pages - a.pages)
    return result
  }, [search, category, sort])

  return (
    <main className="cg-page cg-library">
      <header className="cg-page-heading cg-page-header">
        <div>
          <p className="cg-eyebrow">Congolibs · Collection</p>
          <h1>La bibliothèque</h1>
          <p>Parcourez les livres disponibles et trouvez votre prochaine lecture.</p>
        </div>
        <FiBookOpen className="cg-heading-icon" aria-hidden="true" />
      </header>

      <section className="cg-library-tools" aria-label="Recherche et affichage">
        <label className="cg-search-field">
          <FiSearch aria-hidden="true" />
          <span className="cg-visually-hidden">Rechercher un livre, un auteur ou une catégorie</span>
          <input className="cg-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un livre ou un auteur" />
        </label>
        <label className="cg-select-field">
          <FiSliders aria-hidden="true" />
          <span className="cg-visually-hidden">Trier les livres</span>
          <select className="cg-control" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="popular">Note la plus élevée</option>
            <option value="title">Titre</option>
            <option value="pages">Nombre de pages</option>
          </select>
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

      <section className="cg-section" aria-labelledby="library-results">
        <div className="cg-section-heading">
          <div>
            <p className="cg-eyebrow">Collection</p>
            <h2 id="library-results">{category === 'Tous' ? 'Tous les livres' : category}</h2>
          </div>
          <span className="cg-result-count">{filteredBooks.length} {filteredBooks.length > 1 ? 'livres' : 'livre'}</span>
        </div>
        {filteredBooks.length ? (
          <div className={view === 'grid' ? 'cg-book-grid' : 'cg-book-list'}>
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
                  <span className="cg-book-meta">Note {book.rating}/5 · {book.pages} pages <FiArrowRight aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="cg-empty-state" role="status">
            <FiSearch aria-hidden="true" />
            <h3>Aucun livre trouvé</h3>
            <p>Essayez un autre terme ou choisissez une autre catégorie.</p>
            <button className="cg-button cg-button-secondary cg-secondary-button" onClick={() => { setSearch(''); setCategory('Tous') }}>Réinitialiser les filtres</button>
          </div>
        )}
      </section>
    </main>
  )
}

export default Library
