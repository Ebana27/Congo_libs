import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function Reader() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [metadata, setMetadata] = useState(null)
  const [page, setPage] = useState(1)
  const [images, setImages] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setMetadata(null)
    setImages({})
    setError('')
    setLoading(true)

    fetch(`${API_BASE_URL}/api/v1/documents/${id}/meta/`, {
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          navigate('/connexion', { replace: true, state: { from: `/lecteur/${id}` } })
          return null
        }
        if (!response.ok) {
          throw new Error(response.status === 404
            ? 'Ce document est introuvable ou n’est plus disponible.'
            : 'Impossible de charger les informations du document.')
        }
        return response.json()
      })
      .then((data) => {
        if (!data) return
        setMetadata(data)
        setPage(1)
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [id, navigate])

  useEffect(() => {
    if (!metadata) return undefined

    const controller = new AbortController()
    const objectUrls = []
    setImages({})
    setError('')

    const loadPage = async (pageNumber) => {
      const params = new URLSearchParams({ session: metadata.reading_session })
      const response = await fetch(
        `${API_BASE_URL}/api/v1/documents/${id}/pages/${pageNumber}/?${params}`,
        {
          credentials: 'include',
          cache: 'no-store',
          headers: { Accept: 'image/png' },
          signal: controller.signal,
        },
      )

      if (response.status === 401 || response.status === 403) {
        setImages({})
        navigate('/connexion', { replace: true, state: { from: `/lecteur/${id}` } })
        throw new Error('Votre session a expiré.')
      }
      if (!response.ok) {
        throw new Error(response.status === 404
          ? 'Cette page n’est plus disponible.'
          : 'Impossible de charger cette page.')
      }
      if (!response.headers.get('content-type')?.startsWith('image/png')) {
        throw new Error('Le serveur a renvoyé un format de page inattendu.')
      }

      const imageUrl = URL.createObjectURL(await response.blob())
      objectUrls.push(imageUrl)
      return [pageNumber, imageUrl]
    }

    const pagesToLoad = [page, page + 1].filter(
      (pageNumber) => pageNumber <= metadata.pages,
    )

    Promise.all(pagesToLoad.map(loadPage))
      .then((entries) => setImages(Object.fromEntries(entries)))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })

    return () => {
      controller.abort()
      objectUrls.forEach((objectUrl) => URL.revokeObjectURL(objectUrl))
    }
  }, [id, metadata, page, navigate])

  const changePage = (nextPage) => {
    if (nextPage >= 1 && nextPage <= metadata.pages) {
      setImages({})
      setPage(nextPage)
    }
  }

  return (
    <div className="cg-reader-shell reader-page drm-reader">
      <header className="cg-reader-header reader-header drm-reader-header">
        <button
          className="reader-back"
          onClick={() => navigate(-1)}
          title="Retour"
        >
          <FiArrowLeft />
        </button>
        <div className="reader-book-info">
          <strong>{metadata?.title || 'Lecteur de documents'}</strong>
          {metadata && <span>Lecture protégée</span>}
        </div>
        {metadata && (
          <span className="drm-page-count">
            Page {page} sur {metadata.pages}
          </span>
        )}
      </header>

      <main
        className="cg-reader-content reader-content drm-viewer"
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        onSelectStart={(event) => event.preventDefault()}
      >
        {loading && <p role="status">Chargement du document…</p>}
        {!loading && error && <p className="drm-reader-error" role="alert">{error}</p>}
        {metadata && !error && (
          <>
            <div className="cg-reader-image drm-image-container">
              {images[page]
                ? (
                  <img
                    src={images[page]}
                    alt={`Page ${page} de ${metadata.title}`}
                    draggable="false"
                  />
                )
                : <p role="status">Chargement de la page…</p>}
            </div>
            <nav className="cg-reader-navigation reader-navigation" aria-label="Navigation des pages">
              <button
                className="reader-nav-button"
                disabled={page <= 1}
                onClick={() => changePage(page - 1)}
              >
                <FiChevronLeft />
                <span>Page précédente</span>
              </button>
              <span className="reader-page-number">{page}</span>
              <button
                className="reader-nav-button next"
                disabled={page >= metadata.pages}
                onClick={() => changePage(page + 1)}
              >
                <span>Page suivante</span>
                <FiChevronRight />
              </button>
            </nav>
          </>
        )}
      </main>

      <div className="drm-print-message">
        Le contenu n’est pas disponible pour l’impression.
      </div>
    </div>
  )
}

export default Reader
