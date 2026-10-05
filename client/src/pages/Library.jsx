import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBookOpen, FiGrid, FiList, FiSearch, FiSliders, FiArrowRight } from 'react-icons/fi'
import BookCard from '../components/BookCard'
import { useLibrary } from '../context/LibraryContext'

function Library() {
  const navigate = useNavigate(); const { books, loading, error } = useLibrary()
  const [search,setSearch]=useState(''); const [view,setView]=useState('grid')
  const filtered = useMemo(() => books.filter(b => `${b.title} ${b.author}`.toLowerCase().includes(search.trim().toLowerCase())), [books,search])
  return <div className="library-page">
    <section className="library-header"><div><span className="section-label">CONGOLIBS</span><h1>Ma bibliothèque</h1><p>Les e-books sont récupérés directement depuis l'API de ton équipe.</p></div><div className="library-header-icon"><FiBookOpen /></div></section>
    <section className="library-tools"><div className="library-search"><FiSearch /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un livre, un auteur..." /></div><div className="library-options"><div className="filter-select"><FiSliders /><span>API</span></div><div className="view-buttons"><button className={view==='grid'?'active':''} onClick={()=>setView('grid')}><FiGrid /></button><button className={view==='list'?'active':''} onClick={()=>setView('list')}><FiList /></button></div></div></section>
    <section className="library-results"><div className="library-results-header"><div><span className="section-label">COLLECTION API</span><h2>Tous les livres</h2></div><span className="result-count">{filtered.length} livre{filtered.length>1?'s':''}</span></div>
      {loading ? <div className="empty-library"><h3>Chargement…</h3></div> : error ? <div className="empty-library"><h3>Erreur API</h3><p>{error}</p></div> : filtered.length ? (view==='grid' ? <div className="books-grid library-books-grid">{filtered.map(b=><BookCard key={b.id} book={b}/>)}</div> : <div className="books-list">{filtered.map(book=><article className="book-list-item" key={book.id}><div className="book-list-cover"><FiBookOpen /></div><div className="book-list-info"><span className="book-category">LIVRE</span><h3>{book.title}</h3><p>{book.author}</p></div><button className="book-list-button" onClick={()=>navigate(`/livre/${book.id}`)}>Voir <FiArrowRight /></button></article>)}</div>) : <div className="empty-library"><h3>Aucun livre trouvé</h3><p>Essayez un autre titre ou auteur.</p></div>}
    </section>
  </div>
}
export default Library
