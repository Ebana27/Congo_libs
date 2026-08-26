import { useNavigate, useParams } from 'react-router-dom'
import {
  FiArrowLeft,
  FiBookOpen,
  FiHeart,
  FiShare2,
  FiStar,
  FiBookmark,
  FiClock,
} from 'react-icons/fi'

import books from '../data/books'

function BookDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const book = books.find(
    (item) => item.id === Number(id)
  )

  // Si le livre n'existe pas
  if (!book) {
    return (
      <div className="book-not-found">

        <div className="book-not-found-icon">
          <FiBookOpen />
        </div>

        <h1>
          Livre introuvable
        </h1>

        <p>
          Le livre que vous recherchez n'existe pas
          ou n'est plus disponible.
        </p>

        <button
          onClick={() => navigate('/bibliotheque')}
        >
          <FiArrowLeft />
          Retour à la bibliothèque
        </button>

      </div>
    )
  }

  return (
    <div className="book-details-page">

      {/* RETOUR */}

      <button
        className="back-button"
        onClick={() => navigate('/bibliotheque')}
      >
        <FiArrowLeft />
        Retour à la bibliothèque
      </button>


      {/* INFORMATIONS PRINCIPALES */}

      <section className="book-details-main">

        {/* COUVERTURE */}

        <div className="book-details-cover">

          <div className="book-details-cover-inner">
            <FiBookOpen />

            <strong>
              CONGOLIBS
            </strong>

            <span>
              {book.category}
            </span>
          </div>

        </div>


        {/* INFORMATIONS */}

        <div className="book-details-info">

          <span className="book-details-category">
            {book.category}
          </span>

          <h1>
            {book.title}
          </h1>

          <p className="book-details-author">
            Par <strong>{book.author}</strong>
          </p>


          <div className="book-details-rating">

            <div className="rating-stars">

              <FiStar />
              <FiStar />
              <FiStar />
              <FiStar />
              <FiStar />

            </div>

            <strong>
              {book.rating}
            </strong>

            <span>
              / 5
            </span>

          </div>


          <p className="book-description">
            Découvrez cette œuvre de la littérature
            congolaise à travers CONGOLIBS. Plongez
            dans l'univers de l'auteur et explorez
            une histoire qui participe à la richesse
            de notre patrimoine littéraire.
          </p>


          {/* STATISTIQUES */}

          <div className="book-details-stats">

            <div className="book-stat">

              <FiBookOpen />

              <div>
                <strong>
                  {book.pages}
                </strong>

                <span>
                  Pages
                </span>
              </div>

            </div>


            <div className="book-stat">

              <FiClock />

              <div>
                <strong>
                  ~4h
                </strong>

                <span>
                  Lecture
                </span>
              </div>

            </div>


            <div className="book-stat">

              <FiStar />

              <div>
                <strong>
                  {book.rating}
                </strong>

                <span>
                  Note
                </span>
              </div>

            </div>

          </div>


          {/* ACTIONS */}

          <div className="book-details-actions">

            <button
              className="read-book-button"
              onClick={() =>
                navigate(`/lecteur/${book.id}`)
              }
            >
              <FiBookOpen />
              Lire maintenant
            </button>


            <button
              className="secondary-book-button"
              title="Ajouter aux favoris"
            >
              <FiHeart />
            </button>


            <button
              className="secondary-book-button"
              title="Enregistrer"
            >
              <FiBookmark />
            </button>


            <button
              className="secondary-book-button"
              title="Partager"
            >
              <FiShare2 />
            </button>

          </div>

        </div>

      </section>


      {/* DESCRIPTION */}

      <section className="book-description-section">

        <div className="book-section-heading">

          <span className="section-label">
            À PROPOS DU LIVRE
          </span>

          <h2>
            Présentation
          </h2>

        </div>


        <div className="book-long-description">

          <p>
            <strong>
              {book.title}
            </strong>{' '}
            est une œuvre proposée dans la
            bibliothèque numérique CONGOLIBS.
          </p>

          <p>
            Cette page présente les informations
            essentielles du livre et permettra
            prochainement aux utilisateurs de
            commencer leur lecture directement
            depuis la plateforme.
          </p>

          <p>
            Retrouvez également les autres œuvres
            disponibles dans notre collection de
            littérature congolaise et africaine.
          </p>

        </div>

      </section>


      {/* LIVRES SIMILAIRES */}

      <section className="similar-books-section">

        <div className="book-section-heading">

          <span className="section-label">
            VOUS POURRIEZ AUSSI AIMER
          </span>

          <h2>
            Livres similaires
          </h2>

        </div>


        <div className="similar-books">

          {books
            .filter((item) => item.id !== book.id)
            .slice(0, 3)
            .map((item) => (

              <button
                className="similar-book"
                key={item.id}
                onClick={() =>
                  navigate(`/livre/${item.id}`)
                }
              >

                <div className="similar-book-cover">
                  <FiBookOpen />
                </div>

                <div className="similar-book-info">

                  <span>
                    {item.category}
                  </span>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.author}
                  </p>

                </div>

              </button>

            ))}

        </div>

      </section>

    </div>
  )
}

export default BookDetails