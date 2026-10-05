import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBookOpen, FiSearch, FiGrid, FiList } from 'react-icons/fi'
import { useLibrary } from '../context/LibraryContext'
import BookCard from '../components/BookCard'

function Bibliotheque(){
 const navigate=useNavigate(); const {books,loading,error}=useLibrary(); const [search,setSearch]=useState(''); const [view,setView]=useState('grid')
 const filtered=useMemo(()=>books.filter(b=>`${b.title} ${b.author}`.toLowerCase().includes(search.trim().toLowerCase())),[books,search])
 return <div className="bibliotheque-page"><section className="bibliotheque-header"><div><span className="section-label">MA COLLECTION</span><h1>Bibliothèque</h1><p>Retrouvez les e-books enregistrés dans l'API CONGOLIBS.</p></div><div className="bibliotheque-count"><strong>{loading?'—':filtered.length}</strong><span>livres</span></div></section>
 <section className="bibliotheque-toolbar"><div className="bibliotheque-search"><FiSearch/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un livre ou un auteur..."/></div><div className="bibliotheque-view"><button className={view==='grid'?'active':''} onClick={()=>setView('grid')}><FiGrid/></button><button className={view==='list'?'active':''} onClick={()=>setView('list')}><FiList/></button></div></section>
 {loading?<div className="empty-library"><h3>Chargement…</h3></div>:error?<div className="empty-library"><h3>Erreur API</h3><p>{error}</p></div>:filtered.length?(view==='grid'?<div className="bibliotheque-grid">{filtered.map(book=><BookCard key={book.id} book={book}/>)}</div>:<div className="books-list">{filtered.map(book=><article className="book-list-item" key={book.id} onClick={()=>navigate(`/livre/${book.id}`)}><div className="book-list-cover"><FiBookOpen/></div><div className="book-list-info"><span className="book-category">LIVRE</span><h3>{book.title}</h3><p>{book.author}</p></div></article>)}</div>):<div className="empty-library"><h3>Aucun livre</h3><p>L'API ne renvoie actuellement aucun e-book.</p></div>}
 </div>
}
export default Bibliotheque
