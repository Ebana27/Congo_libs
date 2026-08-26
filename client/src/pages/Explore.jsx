import { useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiBookOpen,
  FiHeart,
  FiSearch,
  FiStar,
  FiTrendingUp,
} from 'react-icons/fi'

import books from '../data/books'

function Explore() {
  const navigate = useNavigate()

  const popularBooks = books.slice(0, 6)

  const categories = [
    {
      name: 'Romans',
      description: 'Découvrez les grands récits.',
      icon: 'R',
    },
    {
      name: 'Poésie',
      description: 'Explorez les mots et les émotions.',
      icon: 'P',
    },
    {
      name: 'Histoire',
      description: 'Plongez dans notre patrimoine.',
      icon: 'H',
    },
    {
      name: 'Culture',
      description: 'Découvrez la richesse congolaise.',
      icon: 'C',
    },
  ]

  return (
    <div className="explore-page">

      {/* HEADER */}

      <section className="explore-header">

        <div>
          <span className="section-label">
            CONGOLIBS
          </span>

          <h1>
            Explorez notre bibliothèque
          </h1>

          <p>
            Découvrez des œuvres, des auteurs et des
            histoires qui font vivre notre culture.
          </p>
        </div>

        <button
          className="explore-search-button"
          onClick={() => navigate('/recherche')}
        >
          <FiSearch />
          Rechercher
        </button>

      </section>


      {/* CATEGORIES */}

      <section className="explore-section">

        <div className="explore-section-header">

          <div>
            <span className="section-label">
              DÉCOUVRIR
            </span>

            <h2>
              Explorer par catégorie
            </h2>
          </div>

          <button
            className="explore-link"
            onClick={() => navigate('/bibliotheque')}
          >
            Voir tout
            <FiArrowRight />
          </button>

        </div>


        <div className="explore-categories">

          {categories.map((category) => (

            <button
              className="explore-category-card"
              key={category.name}
              onClick={() => navigate('/bibliotheque')}
            >

              <div className="explore-category-icon">
                {category.icon}
              </div>

              <div>
                <h3>
                  {category.name}
                </h3>

                <p>
                  {category.description}
                </p>
              </div>

              <FiArrowRight className="category-arrow" />

            </button>

          ))}

        </div>

      </section>


      {/* POPULAR BOOKS */}

      <section className="explore-section">

        <div className="explore-section-header">

          <div>
            <span className="section-label">
              TENDANCES
            </span>

            <h2>
              Livres populaires
            </h2>
          </div>

          <button
            className="explore-link"
            onClick={() => navigate('/bibliotheque')}
          >
            Tous les livres
            <FiArrowRight />
          </button>

        </div>


        <div className="explore-books-grid">

          {popularBooks.map((book) => (

            <article
              className="explore-book-card"
              key={book.id}
              onClick={() =>
                navigate(`/livre/${book.id}`)
              }
            >

              <div className="explore-book-cover">

                <FiBookOpen />

                <button
                  className="explore-favorite"
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


              <div className="explore-book-info">

                <h3>
                  {book.title}
                </h3>

                <p>
                  {book.author}
                </p>

                <div className="explore-book-meta">

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

      </section>


      {/* DISCOVERY BANNER */}

      <section className="explore-banner">

        <div className="explore-banner-icon">
          <FiTrendingUp />
        </div>

        <div className="explore-banner-content">

          <span className="section-label">
            À DÉCOUVRIR
          </span>

          <h2>
            Une bibliothèque qui raconte notre histoire.
          </h2>

          <p>
            Explorez les œuvres d'auteurs congolais et
            découvrez de nouvelles lectures.
          </p>

        </div>

        <button
          onClick={() => navigate('/bibliotheque')}
        >
          Explorer
          <FiArrowRight />
        </button>

      </section>

    </div>
  )
}

export default Explore