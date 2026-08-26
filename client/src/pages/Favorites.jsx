import { useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiBookOpen,
  FiHeart,
  FiStar,
  FiTrash2,
} from 'react-icons/fi'

import books from '../data/books'

function Favorites() {
  const navigate = useNavigate()

  // Pour l'instant, quelques livres sont considérés
  // comme favoris côté frontend.
  const favoriteBooks = books.slice(0, 4)

  return (
    <div className="favorites-page">

      {/* HEADER */}

      <section className="favorites-header">

        <button
          className="favorites-back"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          Retour
        </button>

        <span className="section-label">
          MA BIBLIOTHÈQUE
        </span>

        <div className="favorites-title-row">

          <div>
            <h1>
              Mes favoris
            </h1>

            <p>
              Retrouvez ici les livres que vous
              souhaitez conserver pour plus tard.
            </p>
          </div>

          <div className="favorites-count">
            <FiHeart />

            <strong>
              {favoriteBooks.length}
            </strong>

            <span>
              livres
            </span>
          </div>

        </div>

      </section>


      {/* FAVORIS */}

      {favoriteBooks.length > 0 ? (

        <section className="favorites-list">

          {favoriteBooks.map((book) => (

            <article
              className="favorite-card"
              key={book.id}
            >

              {/* COUVERTURE */}

              <div
                className="favorite-cover"
                onClick={() =>
                  navigate(`/livre/${book.id}`)
                }
              >
                <FiBookOpen />

                <span>
                  {book.category}
                </span>
              </div>


              {/* INFORMATIONS */}

              <div className="favorite-info">

                <span className="favorite-category">
                  {book.category}
                </span>

                <h2>
                  {book.title}
                </h2>

                <p className="favorite-author">
                  {book.author}
                </p>

                <p className="favorite-description">
                  Découvrez cette œuvre dans votre
                  bibliothèque numérique CONGOLIBS.
                </p>


                <div className="favorite-meta">

                  <span>
                    <FiStar />
                    {book.rating}
                  </span>

                  <span>
                    {book.pages} pages
                  </span>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="favorite-actions">

                <button
                  className="favorite-read"
                  onClick={() =>
                    navigate(`/lecteur/${book.id}`)
                  }
                >
                  <FiBookOpen />
                  Lire
                </button>

                <button
                  className="favorite-remove"
                  title="Retirer des favoris"
                >
                  <FiTrash2 />
                </button>

              </div>

            </article>

          ))}

        </section>

      ) : (

        /* AUCUN FAVORI */

        <section className="favorites-empty">

          <div className="favorites-empty-icon">
            <FiHeart />
          </div>

          <h2>
            Aucun favori pour le moment
          </h2>

          <p>
            Ajoutez des livres à vos favoris
            pour les retrouver facilement ici.
          </p>

          <button
            onClick={() => navigate('/bibliotheque')}
          >
            <FiBookOpen />
            Explorer la bibliothèque
          </button>

        </section>

      )}

    </div>
  )
}

export default Favorites