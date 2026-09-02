import { useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiBookOpen,
  FiSearch,
  FiTrendingUp,
  FiChevronRight,
} from 'react-icons/fi'

import BookCard from '../components/BookCard'
import books from '../data/books'

function Home() {
  const navigate = useNavigate()

  const categories = [
    {
      name: 'Littérature congolaise',
      number: '01',
    },
    {
      name: 'Romans',
      number: '02',
    },
    {
      name: 'Éducation',
      number: '03',
    },
    {
      name: 'Histoire',
      number: '04',
    },
    {
      name: 'Sciences',
      number: '05',
    },
    {
      name: 'Développement personnel',
      number: '06',
    },
  ]

  return (
    <div className="home-page">

      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <span className="hero-label">
            BIBLIOTHÈQUE NUMÉRIQUE CONGOLAISE
          </span>

          <h1>
            Votre bibliothèque.
            <br />
            <span>Partout avec vous.</span>
          </h1>

          <p>
            Découvrez les livres, auteurs et œuvres
            qui racontent le Congo et l'Afrique.
          </p>

          <div className="hero-actions">

            <button
              className="hero-button"
              onClick={() => navigate('/explore')}
            >
              Explorer la bibliothèque
              <FiArrowRight />
            </button>

            <button
              className="hero-secondary-button"
              onClick={() => navigate('/bibliotheque')}
            >
              Ma bibliothèque
            </button>

          </div>

        </div>

        <div className="hero-decoration">

          <div className="hero-circle hero-circle-one"></div>

          <div className="hero-circle hero-circle-two"></div>

          <div className="hero-book">

            <FiBookOpen />

            <span>
              CONGOLIBS
            </span>

          </div>

        </div>

      </section>


      {/* RECHERCHE */}

      <section className="home-search-section">

        <div
          className="home-search"
          onClick={() => navigate('/recherche')}
        >

          <FiSearch />

          <input
            type="text"
            placeholder="Que souhaitez-vous lire ?"
            readOnly
          />

          <button>
            Rechercher
          </button>

        </div>

      </section>


      {/* CATEGORIES */}

      <section className="home-section">

        <div className="section-header">

          <div>
            <span className="section-label">
              DÉCOUVRIR
            </span>

            <h2>
              Explorer les catégories
            </h2>
          </div>

          <button
            className="see-all-button"
            onClick={() => navigate('/explore')}
          >
            Toutes les catégories
            <FiArrowRight />
          </button>

        </div>


        <div className="categories-grid">

          {categories.map((category) => (

            <button
              className="category-card"
              key={category.name}
              onClick={() => navigate('/explore')}
            >

              <span className="category-number">
                {category.number}
              </span>

              <span className="category-name">
                {category.name}
              </span>

              <span className="category-arrow">
                <FiChevronRight />
              </span>

            </button>

          ))}

        </div>

      </section>


      {/* LIVRES POPULAIRES */}

      <section className="home-section">

        <div className="section-header">

          <div>
            <span className="section-label">
              LES PLUS LUS
            </span>

            <h2>
              Livres populaires
            </h2>
          </div>

          <button
            className="see-all-button"
            onClick={() => navigate('/explore')}
          >
            Voir tous les livres
            <FiArrowRight />
          </button>

        </div>


        <div className="books-grid">

          {books.slice(0, 4).map((book) => (

            <BookCard
              key={book.id}
              book={book}
            />

          ))}

        </div>

      </section>


      {/* NOUVEAUTÉS */}

      <section className="home-section">

        <div className="section-header">

          <div>
            <span className="section-label">
              NOUVEAUTÉS
            </span>

            <h2>
              Derniers ajouts
            </h2>
          </div>

          <button
            className="see-all-button"
            onClick={() => navigate('/explore')}
          >
            Voir tout
            <FiArrowRight />
          </button>

        </div>


        <div className="books-grid">

          {books.slice(2, 6).map((book) => (

            <BookCard
              key={book.id}
              book={book}
            />

          ))}

        </div>

      </section>


      {/* RECOMMANDATION */}

      <section className="recommendation">

        <div className="recommendation-icon">
          <FiTrendingUp />
        </div>

        <div>

          <span>
            À DÉCOUVRIR
          </span>

          <h2>
            Trouvez votre prochaine lecture.
          </h2>

          <p>
            Parcourez notre collection et découvrez
            de nouvelles œuvres congolaises et africaines.
          </p>

        </div>

        <button
          onClick={() => navigate('/explore')}
        >
          Explorer
          <FiArrowRight />
        </button>

      </section>

    </div>
  )
}

export default Home