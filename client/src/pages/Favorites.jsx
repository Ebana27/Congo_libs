import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiBookOpen, FiHeart } from 'react-icons/fi'

function Favorites() {
  const navigate = useNavigate()

  return (
    <main className="cg-page cg-favorites">
      <header className="cg-page-heading cg-page-header">
        <button className="cg-text-button cg-text-link" onClick={() => navigate(-1)}>
          <FiArrowLeft aria-hidden="true" /> Retour
        </button>
        <div>
          <p className="cg-eyebrow">Ma bibliothèque</p>
          <h1>Mes favoris</h1>
          <p>Les livres que vous choisissez de garder à portée de main.</p>
        </div>
      </header>

      <section className="cg-empty-state" aria-labelledby="favorites-empty-title">
        <FiHeart aria-hidden="true" />
        <h2 id="favorites-empty-title">Aucun favori pour le moment</h2>
        <p>Les favoris ne sont pas encore enregistrés sur votre compte. Parcourez la collection pour découvrir des livres.</p>
        <button className="cg-button cg-button-primary cg-primary-button" onClick={() => navigate('/bibliotheque')}>
          <FiBookOpen aria-hidden="true" /> Explorer la bibliothèque
        </button>
      </section>
    </main>
  )
}

export default Favorites
