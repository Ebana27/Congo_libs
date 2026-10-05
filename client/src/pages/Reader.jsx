import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiBookOpen, FiDownload, FiX } from 'react-icons/fi'
import { useLibrary } from '../context/LibraryContext'
import { downloadDocument } from '../services/api'

function Reader(){
 const {id}=useParams(); const navigate=useNavigate(); const {books,loading}=useLibrary(); const book=books.find(item=>String(item.id)===String(id)); const [pdfUrl,setPdfUrl]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(false)
 const load=async()=>{if(!book)return; try{setBusy(true);setError('');const blob=await downloadDocument(book.id);const url=URL.createObjectURL(blob);setPdfUrl(url)}catch(e){setError(e.message||'Impossible de charger le PDF.')}finally{setBusy(false)}}
 useEffect(()=>{load();return()=>{if(pdfUrl)URL.revokeObjectURL(pdfUrl)}},[book?.id])
 if(loading&&!book)return <div className="empty-library"><h3>Chargement…</h3></div>
 if(!book)return <div className="reader-not-found"><FiBookOpen/><h1>Livre introuvable</h1><button onClick={()=>navigate('/bibliotheque')}>Retour</button></div>
 return <div className="reader-page"><header className="reader-header"><div className="reader-header-left"><button className="reader-back" onClick={()=>navigate(`/livre/${book.id}`)}><FiArrowLeft/></button><div className="reader-book-info"><strong>{book.title}</strong><span>{book.author}</span></div></div><div className="reader-header-actions"><button onClick={load} disabled={busy}><FiDownload/>{busy?'Chargement…':'Recharger'}</button><button onClick={()=>navigate('/bibliotheque')}><FiX/></button></div></header><main className="reader-content reader-pdf-content">{error?<div className="empty-library"><h3>Impossible de charger le livre</h3><p>{error}</p><button onClick={load}>Réessayer</button></div>:pdfUrl?<iframe title={book.title} src={pdfUrl} className="reader-pdf-frame"/>:<div className="empty-library"><h3>Préparation du document…</h3></div>}</main></div>
}
export default Reader
