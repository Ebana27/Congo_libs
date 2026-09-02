import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBookOpen,
  FiHeart,
  FiSearch,
  FiStar,
  FiGrid,
  FiList,
} from 'react-icons/fi'

import books from '../data/books'

function Bibliotheque() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tous')
  const [view, setView] = useState('grid')

  const categories = [
    'Tous',
    ...new Set(
      books.map((book) => book.category)
    ),
  ]

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase()

    return books.filter((book) => {
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)

      const matchesCategory =
        category === 'Tous' ||
        book.category === category

      return matchesSearch && matchesCategory
    })
  }, [search, category])

  return (
    <div className="bibliotheque-page">

      {/* HEADER */}

      <section className="bibliotheque-header">

        <div>
          <span className="section-label">
            MA COLLECTION
          </span>

          <h1>
            Bibliothèque
          </h1>

          <p>
            Retrouvez tous les livres disponibles
            dans votre espace de lecture.
          </p>
        </div>

        <div className="bibliotheque-count">

          <strong>
            {filteredBooks.length}
          </strong>

          <span>
            {filteredBooks.length > 1
              ? 'livres'
              : 'livre'}
          </span>

        </div>

      </section>


      {/* SEARCH + VIEW */}

      <section className="bibliotheque-toolbar">

        <div className="bibliotheque-search">

          <FiSearch />

          <input
            type="text"
            placeholder="Rechercher un livre ou un auteur..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        <div className="bibliotheque-view">

          <button
            className={
              view === 'grid'
                ? 'active'
                : ''
            }
            onClick={() => setView('grid')}
            aria-label="Vue grille"
          >
            <FiGrid />
          </button>

          <button
            className={
              view === 'list'
                ? 'active'
                : ''
            }
            onClick={() => setView('list')}
            aria-label="Vue liste"
          >
            <FiList />
          </button>

        </div>

      </section>


      {/* FILTERS */}

      <section className="bibliotheque-filters">

        {categories.map((item) => (

          <button
            key={item}
            className={
              category === item
                ? 'active'
                : ''
            }
            onClick={() => setCategory(item)}
          >
            {item}
          </button>

        ))}

      </section>


      {/* BOOKS */}

      {filteredBooks.length > 0 ? (

        view === 'grid' ? (

          <div className="bibliotheque-grid">

            {filteredBooks.map((book) => (

              <article
                className="bibliotheque-card"
                key={book.id}
                onClick={() =>
                  navigate(`/livre/${book.id}`)
                }
              >

                <div className="bibliotheque-cover">

                  <FiBookOpen />

                  <button
                    className="bibliotheque-favorite"
                    onClick={(event) => {
                      event.stopPropagation()
                    }}
                    aria-label="Ajouter aux favoris"
                  >
                    <FiHeart />
                  </button>

                  <span>
                    {book.category}
                  </span>

                </div>


                <div className="bibliotheque-info">

                  <h2>
                    {book.title}
                  </h2>

                  <p>
                    {book.author}
                  </p>

                  <div className="bibliotheque-meta">

                    <span>
                      <FiStar />
                      {book.rating}
                    </span>

                    <span>
                      {book.pages} pages
                    </span>

                  </div>

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="bibliotheque-list">

            {filteredBooks.map((book) => (

              <article
                className="bibliotheque-list-card"
                key={book.id}
                onClick={() =>
                  navigate(`/livre/${book.id}`)
                }
              >

                <div className="bibliotheque-list-cover">
                  <FiBookOpen />
                </div>

                <div className="bibliotheque-list-info">

                  <span className="bibliotheque-list-category">
                    {book.category}
                  </span>

                  <h2>
                    {book.title}
                  </h2>

                  <p>
                    {book.author}
                  </p>

                  <div className="bibliotheque-meta">

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
                  className="bibliotheque-list-favorite"
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                  aria-label="Ajouter aux favoris"
                >
                  <FiHeart />
                </button>

              </article>

            ))}

          </div>

        )

      ) : (

        <div className="bibliotheque-empty">

          <div className="bibliotheque-empty-icon">
            <FiSearch />
          </div>

          <h2>
            Aucun livre trouvé
          </h2>

          <p>
            Aucun résultat ne correspond à votre
            recherche.
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

    </div>
  )
}

export default Bibliotheque