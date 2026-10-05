import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiTrendingUp, FiRefreshCw, FiHeart, FiChevronDown } from 'react-icons/fi'
import { useLibrary } from '../context/LibraryContext'

function Home() {
  const navigate = useNavigate()
  const { books, loading } = useLibrary()
  const count = books.length
  const features = [
    { icon: <FiBookOpen />, title: 'Apprendre', text: 'Explore les ressources disponibles dans la bibliothèque numérique.', tag: loading ? 'Chargement…' : `${count} livres disponibles` },
    { icon: <FiTrendingUp />, title: 'Progresser', text: 'Retrouve rapidement les documents utiles à ton apprentissage.', tag: 'Ressources en ligne' },
    { icon: <FiRefreshCw />, title: 'Réviser', text: 'Recherche par titre, type, matière ou catégorie selon les ressources.', tag: 'Recherche API' },
  ]

  return <div className="home-page hv3">
    <section className="hv3-hero">
      <div className="hv3-hero-content">
        <span className="hv3-badge">BIBLIOTHÈQUE NUMÉRIQUE CONGOLAISE</span>
        <h1>Débloque ton<br />potentiel de lecture.</h1>
        <p>Apprends, progresse et révise. Toute la connaissance et les ressources de CONGOLIBS à portée de main.</p>
        <div className="hv3-hero-actions">
          <button className="hv3-btn-dark" onClick={() => navigate('/explore')}>Commencer maintenant <FiArrowRight /></button>
          <button className="hv3-btn-outline" onClick={() => navigate('/bibliotheque')}>Ma bibliothèque</button>
        </div>
      </div>
      <div className="hv3-art" aria-hidden="true"><div className="hv3-art-ring" /><div className="hv3-art-can"><div className="hv3-art-can-top" /></div><div className="hv3-art-ball" /></div>
    </section>

    <section className="hv3-stat-strip">
      <div className="hv3-stat-text"><span className="hv3-eyebrow">Découvrir maintenant</span><h3>Découvre les<br />ressources</h3></div>
      <div className="hv3-stat-chips">
        <div className="hv3-chip"><FiBookOpen /><div><strong>{loading ? '—' : count}</strong><span>livres API</span></div></div>
        <div className="hv3-chip"><FiHeart /><div><strong>API</strong><span>connectée en ligne</span></div></div>
      </div>
      <p className="hv3-stat-note">Les ressources affichées proviennent directement de l'API CONGOLIBS de ton équipe.</p>
    </section>

    <section className="hv3-features">{features.map((feature) => <div className="hv3-feature-card" key={feature.title}><div className="hv3-feature-icon">{feature.icon}</div><h4>{feature.title}</h4><p>{feature.text}</p><span className="hv3-feature-tag">{feature.tag}<FiArrowRight /></span></div>)}</section>
    <div className="hv3-chevron"><FiChevronDown /></div>
    <section className="hv3-cta"><h2>Prêt à faire progresser<br />ton savoir&nbsp;?</h2><p>Explore les ressources et commence ta prochaine lecture.</p><button onClick={() => navigate('/explore')}>Rejoindre gratuitement</button></section>
  </div>
}
export default Home
