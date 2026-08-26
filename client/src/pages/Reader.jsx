import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiMinus,
  FiPlus,
  FiSettings,
  FiX,
} from 'react-icons/fi'

import books from '../data/books'

function Reader() {
  const { id } = useParams()
  const navigate = useNavigate()

  const book = books.find(
    (item) => item.id === Number(id)
  )

  const [chapter, setChapter] = useState(1)
  const [fontSize, setFontSize] = useState(18)
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  if (!book) {
    return (
      <div className="reader-not-found">
        <FiBookOpen />

        <h1>
          Livre introuvable
        </h1>

        <p>
          Impossible de charger ce livre.
        </p>

        <button
          onClick={() => navigate('/bibliotheque')}
        >
          Retour à la bibliothèque
        </button>
      </div>
    )
  }

  const chapters = [
    'Introduction',
    'Chapitre 1 — Le commencement',
    'Chapitre 2 — Les rencontres',
    'Chapitre 3 — Le voyage',
    'Chapitre 4 — Les souvenirs',
    'Chapitre 5 — La découverte',
    'Chapitre 6 — Le changement',
    'Conclusion',
  ]

  const progress = Math.round(
    (chapter / chapters.length) * 100
  )

  const nextChapter = () => {
    if (chapter < chapters.length) {
      setChapter(chapter + 1)
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  const previousChapter = () => {
    if (chapter > 1) {
      setChapter(chapter - 1)
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="reader-page">

      {/* HEADER */}

      <header className="reader-header">

        <div className="reader-header-left">

          <button
            className="reader-back"
            onClick={() =>
              navigate(`/livre/${book.id}`)
            }
            title="Retour au livre"
          >
            <FiArrowLeft />
          </button>

          <div className="reader-book-info">

            <strong>
              {book.title}
            </strong>

            <span>
              {book.author}
            </span>

          </div>

        </div>


        <div className="reader-header-center">

          <span>
            {progress}%
          </span>

          <div className="reader-progress">
            <div
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

        </div>


        <div className="reader-header-actions">

          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            title="Sommaire"
          >
            <FiMenu />
          </button>

          <button
            onClick={() =>
              setSettingsOpen(!settingsOpen)
            }
            title="Paramètres de lecture"
          >
            <FiSettings />
          </button>

        </div>

      </header>


      {/* SOMMAIRE MOBILE / PANNEAU */}

      {menuOpen && (

        <div className="reader-overlay">

          <aside className="reader-menu">

            <div className="reader-menu-header">

              <div>
                <span>
                  SOMMAIRE
                </span>

                <h2>
                  {book.title}
                </h2>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
              >
                <FiX />
              </button>

            </div>


            <div className="reader-chapters">

              {chapters.map((item, index) => (

                <button
                  key={item}
                  className={
                    chapter === index + 1
                      ? 'reader-chapter active'
                      : 'reader-chapter'
                  }
                  onClick={() => {
                    setChapter(index + 1)
                    setMenuOpen(false)
                  }}
                >

                  <span>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <strong>
                    {item}
                  </strong>

                </button>

              ))}

            </div>

          </aside>

        </div>

      )}


      {/* PARAMÈTRES */}

      {settingsOpen && (

        <div className="reader-settings">

          <div className="reader-settings-title">
            Taille du texte
          </div>

          <div className="font-controls">

            <button
              onClick={() =>
                setFontSize(
                  Math.max(14, fontSize - 2)
                )
              }
            >
              <FiMinus />
            </button>

            <span>
              {fontSize}px
            </span>

            <button
              onClick={() =>
                setFontSize(
                  Math.min(26, fontSize + 2)
                )
              }
            >
              <FiPlus />
            </button>

          </div>

        </div>

      )}


      {/* LECTURE */}

      <main className="reader-content">

        <div className="reader-top">

          <span>
            CHAPITRE {chapter}
          </span>

          <div>
            {String(chapter).padStart(2, '0')}
            {' / '}
            {String(chapters.length).padStart(2, '0')}
          </div>

        </div>


        <article className="reader-article">

          <h1>
            {chapters[chapter - 1]}
          </h1>

          <div className="reader-separator">
            <span />
          </div>


          <p style={{ fontSize: `${fontSize}px` }}>
            Dans les rues animées de la ville,
            les premiers rayons du soleil
            commençaient à apparaître derrière
            les bâtiments.
          </p>

          <p style={{ fontSize: `${fontSize}px` }}>
            Le personnage avançait lentement,
            observant autour de lui chaque détail
            de ce paysage qu'il connaissait pourtant
            depuis longtemps.
          </p>

          <p style={{ fontSize: `${fontSize}px` }}>
            Il y avait quelque chose de différent
            ce matin-là. Une impression difficile
            à expliquer, comme si une nouvelle
            histoire était sur le point de commencer.
          </p>

          <blockquote style={{ fontSize: `${fontSize}px` }}>
            « Chaque voyage commence par un premier
            pas, même lorsque nous ne savons pas
            encore où le chemin nous conduira. »
          </blockquote>

          <p style={{ fontSize: `${fontSize}px` }}>
            Il continua son chemin, porté par cette
            curiosité qui l'avait toujours poussé
            à découvrir de nouveaux horizons.
            Derrière lui restaient les souvenirs
            d'une époque révolue.
          </p>

          <p style={{ fontSize: `${fontSize}px` }}>
            Devant lui se dessinait désormais
            une histoire nouvelle, pleine de
            rencontres, de découvertes et de
            possibilités.
          </p>

        </article>


        {/* NAVIGATION */}

        <div className="reader-navigation">

          <button
            className="reader-nav-button"
            disabled={chapter === 1}
            onClick={previousChapter}
          >
            <FiChevronLeft />

            <div>
              <span>
                PRÉCÉDENT
              </span>

              <strong>
                {chapter > 1
                  ? chapters[chapter - 2]
                  : 'Début du livre'}
              </strong>
            </div>

          </button>


          <div className="reader-page-number">
            {chapter}
          </div>


          <button
            className="reader-nav-button next"
            disabled={
              chapter === chapters.length
            }
            onClick={nextChapter}
          >

            <div>
              <span>
                SUIVANT
              </span>

              <strong>
                {chapter < chapters.length
                  ? chapters[chapter]
                  : 'Fin du livre'}
              </strong>
            </div>

            <FiChevronRight />

          </button>

        </div>

      </main>

    </div>
  )
}

export default Reader