import { useParams } from 'react-router'
function CategoryPage() {
	const { categoryId } = useParams()
	return <div>Category Page {categoryId}</div>
}

export default CategoryPage
