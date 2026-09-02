import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiSearch,
  FiStar,
  FiX,
} from 'react-icons/fi'

import books from '../data/books'

function Search() {
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')

  const results = useMemo(() => {
    const value = query.trim().toLowerCase()

    if (!value) {
      return []
    }

    return books.filter((book) => {
      const title = book.title.toLowerCase()
      const author = book.author.toLowerCase()
      const category = book.category.toLowerCase()

      if (type === 'books') {
        return title.includes(value)
      }

      if (type === 'authors') {
        return author.includes(value)
      }

      return (
        title.includes(value) ||
        author.includes(value) ||
        category.includes(value)
      )
    })
  }, [query, type])

  const clearSearch = () => {
    setQuery('')
  }

  return (
    <div className="search-page">

      {/* HEADER */}

      <section className="search-page-header">

        <button
          className="search-back-button"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          Retour
        </button>

        <span className="section-label">
          CONGOLIBS
        </span>

        <h1>
          Rechercher
        </h1>

        <p>
          Trouvez rapidement un livre, un auteur
          ou une œuvre dans notre bibliothèque.
        </p>

      </section>


      {/* SEARCH BOX */}

      <section className="global-search-box">

        <FiSearch />

        <input
          type="text"
          autoFocus
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Rechercher un livre ou un auteur..."
        />

        {query && (
          <button
            className="clear-search"
            onClick={clearSearch}
            aria-label="Effacer la recherche"
          >
            <FiX />
          </button>
        )}

        <button className="search-submit">
          Rechercher
        </button>

      </section>


      {/* FILTRES */}

      <section className="search-filters">

        <button
          className={
            type === 'all'
              ? 'search-filter active'
              : 'search-filter'
          }
          onClick={() => setType('all')}
        >
          Tout
        </button>

        <button
          className={
            type === 'books'
              ? 'search-filter active'
              : 'search-filter'
          }
          onClick={() => setType('books')}
        >
          Livres
        </button>

        <button
          className={
            type === 'authors'
              ? 'search-filter active'
              : 'search-filter'
          }
          onClick={() => setType('authors')}
        >
          Auteurs
        </button>

      </section>


      {/* ÉTAT INITIAL */}

      {!query && (

        <section className="search-empty">

          <div className="search-empty-icon">
            <FiSearch />
          </div>

          <h2>
            Que souhaitez-vous lire ?
          </h2>

          <p>
            Commencez à saisir un titre, un auteur
            ou une catégorie pour lancer votre recherche.
          </p>

          <div className="popular-searches">

            <span>
              Suggestions :
            </span>

            <button
              onClick={() => setQuery('Alain Mabanckou')}
            >
              Alain Mabanckou
            </button>

            <button
              onClick={() => setQuery('Roman')}
            >
              Roman
            </button>

            <button
              onClick={() => setQuery('Sony Labou Tansi')}
            >
              Sony Labou Tansi
            </button>

          </div>

        </section>

      )}


      {/* RÉSULTATS */}

      {query && (

        <section className="search-results">

          <div className="search-results-header">

            <div>

              <span className="section-label">
                RÉSULTATS
              </span>

              <h2>
                Résultats pour « {query} »
              </h2>

            </div>

            <span className="search-result-count">
              {results.length}{' '}
              {results.length > 1
                ? 'résultats'
                : 'résultat'}
            </span>

          </div>


          {results.length > 0 ? (

            <div className="search-results-list">

              {results.map((book) => (

                <article
                  className="search-result-card"
                  key={book.id}
                  onClick={() =>
                    navigate(`/livre/${book.id}`)
                  }
                >

                  <div className="search-result-cover">
                    <FiBookOpen />
                  </div>


                  <div className="search-result-info">

                    <span>
                      {book.category}
                    </span>

                    <h3>
                      {book.title}
                    </h3>

                    <p>
                      {book.author}
                    </p>

                    <div className="search-result-meta">

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
                    className="search-result-button"
                    onClick={(event) => {
                      event.stopPropagation()

                      navigate(`/livre/${book.id}`)
                    }}
                  >
                    Voir
                    <FiArrowRight />
                  </button>

                </article>

              ))}

            </div>

          ) : (

            <div className="no-search-results">

              <div className="no-results-icon">
                <FiSearch />
              </div>

              <h3>
                Aucun résultat
              </h3>

              <p>
                Aucun livre ou auteur ne correspond
                à votre recherche.
              </p>

              <button
                onClick={clearSearch}
              >
                Nouvelle recherche
              </button>

            </div>

          )}

        </section>

      )}

    </div>
  )
}

export default Search