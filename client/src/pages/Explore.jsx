import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiHeart, FiSearch, FiTrendingUp } from 'react-icons/fi'
import { useLibrary } from '../context/LibraryContext'
import BookCard from '../components/BookCard'

function Explore() {
  const navigate = useNavigate()
  const { books, loading, error } = useLibrary()
  const popularBooks = books.slice(0, 6)
  const categories = ['Livres', 'Concours', 'BAC', 'Documents']
  return <div className="explore-page">
    <section className="explore-header"><div><span className="section-label">CONGOLIBS</span><h1>Explorez notre bibliothèque</h1><p>Découvrez les ressources réellement disponibles sur l'API CONGOLIBS.</p></div><button className="explore-search-button" onClick={() => navigate('/recherche')}><FiSearch />Rechercher</button></section>
    <section className="explore-section"><div className="explore-section-header"><div><span className="section-label">DÉCOUVRIR</span><h2>Explorer par catégorie</h2></div><button className="explore-link" onClick={() => navigate('/bibliotheque')}>Voir tout <FiArrowRight /></button></div><div className="explore-categories">{categories.map((name) => <button className="explore-category-card" key={name} onClick={() => navigate('/bibliotheque')}><div className="explore-category-icon">{name[0]}</div><div><h3>{name}</h3><p>Ressources disponibles via l'API.</p></div><FiArrowRight className="category-arrow" /></button>)}</div></section>
    <section className="explore-section"><div className="explore-section-header"><div><span className="section-label">API EN LIGNE</span><h2>Livres disponibles</h2></div><button className="explore-link" onClick={() => navigate('/bibliotheque')}>Tous les livres <FiArrowRight /></button></div>{loading ? <div className="empty-library"><h3>Chargement des livres…</h3></div> : error ? <div className="empty-library"><h3>Impossible de charger les livres</h3><p>{error}</p></div> : <div className="explore-books-grid">{popularBooks.map((book) => <BookCard key={book.id} book={book} />)}</div>}</section>
    <section className="explore-banner"><div className="explore-banner-icon"><FiTrendingUp /></div><div className="explore-banner-content"><span className="section-label">À DÉCOUVRIR</span><h2>Une bibliothèque qui raconte notre histoire.</h2><p>Les données sont chargées depuis le Backend de ton équipe.</p></div><button onClick={() => navigate('/bibliotheque')}>Explorer <FiArrowRight /></button></section>
  </div>
}
export default Explore
