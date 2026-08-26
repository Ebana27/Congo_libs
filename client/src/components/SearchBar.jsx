import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

function SearchBar({ value = '', onChange, placeholder = 'Rechercher un livre, un auteur...' }) {
  const navigate = useNavigate()

  return (
    <div className="shared-search-bar">
      <FiSearch />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => {
          if (!onChange) navigate('/recherche')
        }}
      />
    </div>
  )
}

export default SearchBar
