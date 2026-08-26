import { useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiEdit3,
  FiHeart,
  FiSettings,
  FiStar,
  FiUser,
} from 'react-icons/fi'

import books from '../data/books'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const favoriteBooks = books.slice(0, 3)
  const recentBooks = books.slice(2, 5)

  return (
    <div className="profile-page">

      {/* HEADER */}

      <section className="profile-header">

        <div className="profile-user">

          <div className="profile-avatar">
            <FiUser />
          </div>

          <div className="profile-user-info">

            <span className="section-label">
              MON ESPACE
            </span>

            <h1>
              Mon profil
            </h1>

            <p>
              Bienvenue dans votre espace personnel
              CONGOLIBS.
            </p>

          </div>

        </div>

        <div className="profile-header-actions">

          <button
            className="profile-edit-button"
            onClick={() => {}}
          >
            <FiEdit3 />
            Modifier
          </button>

          <button
            className="profile-settings-button"
            onClick={() => navigate('/settings')}
            aria-label="Paramètres"
          >
            <FiSettings />
          </button>

          <button
            className="profile-logout-button"
            onClick={logout}
          >
            Déconnexion
          </button>

        </div>

      </section>


      {/* PROFILE INFORMATION */}

      <section className="profile-main-grid">

        <div className="profile-card profile-information">

          <div className="profile-card-header">

            <div>
              <span className="section-label">
                INFORMATIONS
              </span>

              <h2>
                Mon compte
              </h2>
            </div>

            <FiUser />

          </div>


          <div className="profile-details">

            <div className="profile-detail">

              <span>
                Nom
              </span>

              <strong>
                {user?.name || 'Utilisateur CONGOLIBS'}
              </strong>

            </div>

            <div className="profile-detail">

              <span>
                Adresse e-mail
              </span>

              <strong>
                {user?.email || 'utilisateur@congolibs.com'}
              </strong>

            </div>

            <div className="profile-detail">

              <span>
                Membre depuis
              </span>

              <strong>
                2026
              </strong>

            </div>

          </div>

        </div>


        {/* STATISTICS */}

        <div className="profile-card profile-statistics">

          <div className="profile-card-header">

            <div>
              <span className="section-label">
                ACTIVITÉ
              </span>

              <h2>
                Mes statistiques
              </h2>
            </div>

            <FiClock />

          </div>


          <div className="profile-stats-grid">

            <div className="profile-stat">

              <FiBookOpen />

              <strong>
                {books.length}
              </strong>

              <span>
                Livres disponibles
              </span>

            </div>

            <div className="profile-stat">

              <FiHeart />

              <strong>
                {favoriteBooks.length}
              </strong>

              <span>
                Favoris
              </span>

            </div>

            <div className="profile-stat">

              <FiClock />

              <strong>
                12h
              </strong>

              <span>
                Temps de lecture
              </span>

            </div>

            <div className="profile-stat">

              <FiStar />

              <strong>
                8
              </strong>

              <span>
                Livres terminés
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* FAVORITES */}

      <section className="profile-section">

        <div className="profile-section-header">

          <div>
            <span className="section-label">
              MA COLLECTION
            </span>

            <h2>
              Mes favoris
            </h2>
          </div>

          <button
            className="profile-see-all"
            onClick={() => navigate('/favoris')}
          >
            Voir tout
            <FiArrowRight />
          </button>

        </div>


        <div className="profile-books-grid">

          {favoriteBooks.map((book) => (

            <article
              className="profile-book-card"
              key={book.id}
              onClick={() =>
                navigate(`/livre/${book.id}`)
              }
            >

              <div className="profile-book-cover">

                <FiBookOpen />

                <span>
                  {book.category}
                </span>

              </div>

              <div className="profile-book-info">

                <h3>
                  {book.title}
                </h3>

                <p>
                  {book.author}
                </p>

              </div>

            </article>

          ))}

        </div>

      </section>


      {/* RECENTLY READ */}

      <section className="profile-section">

        <div className="profile-section-header">

          <div>
            <span className="section-label">
              ACTIVITÉ RÉCENTE
            </span>

            <h2>
              Lectures récentes
            </h2>
          </div>

          <button
            className="profile-see-all"
            onClick={() => navigate('/bibliotheque')}
          >
            Bibliothèque
            <FiArrowRight />
          </button>

        </div>


        <div className="profile-recent-list">

          {recentBooks.map((book, index) => (

            <article
              className="profile-recent-card"
              key={book.id}
              onClick={() =>
                navigate(`/livre/${book.id}`)
              }
            >

              <div className="profile-recent-number">
                0{index + 1}
              </div>

              <div className="profile-recent-cover">
                <FiBookOpen />
              </div>

              <div className="profile-recent-info">

                <h3>
                  {book.title}
                </h3>

                <p>
                  {book.author}
                </p>

                <div className="profile-progress">

                  <div className="profile-progress-bar">
                    <span
                      style={{
                        width: `${65 - index * 15}%`,
                      }}
                    />
                  </div>

                  <small>
                    {65 - index * 15}% lu
                  </small>

                </div>

              </div>

              <FiArrowRight className="profile-recent-arrow" />

            </article>

          ))}

        </div>

      </section>


      {/* SETTINGS BANNER */}

      <section className="profile-settings-banner">

        <div className="profile-settings-icon">
          <FiSettings />
        </div>

        <div className="profile-settings-content">

          <h2>
            Personnalisez votre expérience
          </h2>

          <p>
            Gérez vos préférences, vos notifications
            et les paramètres de votre compte.
          </p>

        </div>

        <button
          onClick={() => navigate('/settings')}
        >
          Paramètres
          <FiArrowRight />
        </button>

      </section>

    </div>
  )
}

export default Profile