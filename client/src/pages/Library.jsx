import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBookOpen,
  FiGrid,
  FiList,
  FiSearch,
  FiSliders,
  FiStar,
  FiArrowRight,
} from 'react-icons/fi'

import BookCard from '../components/BookCard'
import books from '../data/books'

function Library() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tous')
  const [sort, setSort] = useState('popular')
  const [view, setView] = useState('grid')

  const categories = [
    'Tous',
    'Littérature congolaise',
    'Roman',
    'Littérature',
    'Récit',
    'Éducation',
    'Histoire',
    'Sciences',
  ]

  const filteredBooks = useMemo(() => {
    let result = [...books]

    // Recherche
    if (search.trim()) {
      const query = search.toLowerCase()

      result = result.filter((book) =>
        `${book.title} ${book.author} ${book.category}`
          .toLowerCase()
          .includes(query)
      )
    }

    // Catégorie
    if (category !== 'Tous') {
      result = result.filter(
        (book) => book.category === category
      )
    }

    // Tri
    if (sort === 'popular') {
      result.sort((a, b) => b.rating - a.rating)
    }

    if (sort === 'title') {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      )
    }

    if (sort === 'pages') {
      result.sort((a, b) => b.pages - a.pages)
    }

    return result
  }, [search, category, sort])

  return (
    <div className="library-page">

      {/* EN-TÊTE */}

      <section className="library-header">

        <div>
          <span className="section-label">
            CONGOLIBS
          </span>

          <h1>
            Ma bibliothèque
          </h1>

          <p>
            Découvrez notre collection de livres
            et trouvez votre prochaine lecture.
          </p>
        </div>

        <div className="library-header-icon">
          <FiBookOpen />
        </div>

      </section>


      {/* BARRE DE RECHERCHE */}

      <section className="library-tools">

        <div className="library-search">

          <FiSearch />

          <input
            type="text"
            placeholder="Rechercher un livre, un auteur..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        <div className="library-options">

          <div className="filter-select">

            <FiSliders />

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
            >
              <option value="popular">
                Plus populaires
              </option>

              <option value="title">
                Par titre
              </option>

              <option value="pages">
                Nombre de pages
              </option>
            </select>

          </div>


          <div className="view-buttons">

            <button
              className={
                view === 'grid' ? 'active' : ''
              }
              onClick={() => setView('grid')}
              aria-label="Affichage en grille"
            >
              <FiGrid />
            </button>

            <button
              className={
                view === 'list' ? 'active' : ''
              }
              onClick={() => setView('list')}
              aria-label="Affichage en liste"
            >
              <FiList />
            </button>

          </div>

        </div>

      </section>


      {/* CATÉGORIES */}

      <section className="library-categories">

        <div className="category-scroll">

          {categories.map((item) => (

            <button
              key={item}
              className={
                category === item
                  ? 'category-filter active'
                  : 'category-filter'
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>

          ))}

        </div>

      </section>


      {/* RÉSULTATS */}

      <section className="library-results">

        <div className="library-results-header">

          <div>
            <span className="section-label">
              COLLECTION
            </span>

            <h2>
              {category === 'Tous'
                ? 'Tous les livres'
                : category}
            </h2>
          </div>

          <span className="result-count">
            {filteredBooks.length}{' '}
            {filteredBooks.length > 1
              ? 'livres'
              : 'livre'}
          </span>

        </div>


        {filteredBooks.length > 0 ? (

          view === 'grid' ? (

            <div className="books-grid library-books-grid">

              {filteredBooks.map((book) => (

                <BookCard
                  key={book.id}
                  book={book}
                />

              ))}

            </div>

          ) : (

            <div className="books-list">

              {filteredBooks.map((book) => (

                <article
                  className="book-list-item"
                  key={book.id}
                >

                  <div className="book-list-cover">
                    <FiBookOpen />
                  </div>

                  <div className="book-list-info">

                    <span className="book-category">
                      {book.category}
                    </span>

                    <h3>
                      {book.title}
                    </h3>

                    <p>
                      {book.author}
                    </p>

                    <div className="book-list-meta">

                      <span>
                        <FiStar />
                        {book.rating}
                      </span>

                      <span>
                        {book.pages} pages
                      </span>

                    </div>

                  </div>

                  <button
                    className="book-list-button"
                    onClick={() =>
                      navigate(`/livre/${book.id}`)
                    }
                  >
                    Voir le livre
                    <FiArrowRight />
                  </button>

                </article>

              ))}

            </div>

          )

        ) : (

          <div className="empty-library">

            <div className="empty-library-icon">
              <FiSearch />
            </div>

            <h3>
              Aucun livre trouvé
            </h3>

            <p>
              Essayez avec un autre mot-clé ou
              sélectionnez une autre catégorie.
            </p>

            <button
              onClick={() => {
                setSearch('')
                setCategory('Tous')
              }}
            >
              Réinitialiser les filtres
            </button>

          </div>

        )}

      </section>

    </div>
  )
}

export default Library