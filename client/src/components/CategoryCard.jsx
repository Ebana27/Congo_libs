import { FiArrowRight } from 'react-icons/fi'

function CategoryCard({ name, description, icon, onClick }) {
  return (
    <button className="category-card" onClick={onClick}>
      <span className="category-number">{icon}</span>
      <span className="category-name-block">
        <strong>{name}</strong>
        {description && <small>{description}</small>}
      </span>
      <FiArrowRight className="category-arrow" />
    </button>
  )
}

export default CategoryCard
