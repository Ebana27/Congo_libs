import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiBookOpen, FiSearch, FiX } from 'react-icons/fi'
import { useLibrary } from '../context/LibraryContext'
import { getDocuments } from '../services/api'

function Search(){
 const navigate=useNavigate(); const {books}=useLibrary(); const [query,setQuery]=useState(''); const [type,setType]=useState('all'); const [apiResults,setApiResults]=useState([]); const [loading,setLoading]=useState(false)
 const localResults=useMemo(()=>{const v=query.trim().toLowerCase(); if(!v)return []; return books.filter(b=>{if(type==='books')return b.title.toLowerCase().includes(v); if(type==='authors')return b.author.toLowerCase().includes(v); return `${b.title} ${b.author}`.toLowerCase().includes(v)})},[books,query,type])
 const searchApi=async()=>{if(!query.trim()){setApiResults([]);return} setLoading(true); try{const data=await getDocuments({q:query.trim()}); setApiResults(Array.isArray(data)?data:data?.results||[])}catch{setApiResults([])}finally{setLoading(false)}}
 return <div className="search-page"><section className="search-page-header"><button className="search-back-button" onClick={()=>navigate(-1)}><FiArrowLeft/>Retour</button><span className="section-label">CONGOLIBS</span><h1>Rechercher</h1><p>La recherche utilise les données de l'API CONGOLIBS.</p></section>
 <section className="global-search-box"><FiSearch/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&searchApi()} placeholder="Rechercher un livre ou un document..."/>{query&&<button className="clear-search" onClick={()=>{setQuery('');setApiResults([])}}><FiX/></button>}<button className="search-submit" onClick={searchApi}>Rechercher</button></section>
 <section className="search-filters"><button className={type==='all'?'search-filter active':'search-filter'} onClick={()=>setType('all')}>Tout</button><button className={type==='books'?'search-filter active':'search-filter'} onClick={()=>setType('books')}>Livres</button><button className={type==='authors'?'search-filter active':'search-filter'} onClick={()=>setType('authors')}>Auteurs</button></section>
 <section className="search-results"><div className="search-results-header"><span className="section-label">RÉSULTATS</span><h2>{loading?'Recherche…':`${localResults.length+apiResults.length} résultat${localResults.length+apiResults.length>1?'s':''}`}</h2></div>
 {localResults.length? <div className="search-results-grid">{localResults.map(book=><article className="search-result-card" key={`book-${book.id}`} onClick={()=>navigate(`/livre/${book.id}`)}><div className="search-result-cover"><FiBookOpen/></div><div><span className="book-category">LIVRE</span><h3>{book.title}</h3><p>{book.author}</p></div></article>)}</div>:null}
 {apiResults.length?<div className="search-results-grid">{apiResults.map(doc=><article className="search-result-card" key={`doc-${doc.id}`}><div className="search-result-cover"><FiBookOpen/></div><div><span className="book-category">{doc.type||'DOCUMENT'}</span><h3>{doc.nom}</h3><p>{doc.date_creation?new Date(doc.date_creation).toLocaleDateString('fr-FR'):''}</p></div></article>)}</div>:null}
 {!loading&&!localResults.length&&!apiResults.length&&<div className="empty-library"><h3>Aucun résultat</h3><p>Lancez une recherche pour interroger l'API.</p></div>}</section></div>
}
export default Search
