import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchBooks } from '../services/api'

const LibraryContext = createContext(null)

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshBooks = async () => {
    try {
      setLoading(true)
      setError('')
      setBooks(await fetchBooks())
    } catch (requestError) {
      setError(requestError.message || 'Impossible de charger la bibliothèque.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshBooks()
  }, [])

  const value = useMemo(() => ({ books, loading, error, refreshBooks }), [books, loading, error])
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) throw new Error('useLibrary doit être utilisé dans LibraryProvider')
  return context
}
