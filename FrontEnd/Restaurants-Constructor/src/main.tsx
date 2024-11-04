import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Admin from './admin/Admin.tsx'
import AddRestaurants from './Pages/AddRestaurants.tsx'
import Error404Page from './Pages/Error404Page.tsx'
import { fetchedRestaurantsType } from './data.ts'

const Main = () => {
	//const [title, setTitle] = useState<string | null>(null)
	//const [description, setDescription] = useState<string | null>(null)
	//const [imgUrl, setImgUrl] = useState<string | null>(null)

	const [restaurantData, setRestaurantData] = useState<
		fetchedRestaurantsType[]
	>([])

	const router = createBrowserRouter([
		{
			path: '/',
			element: <App />,
			errorElement: <Error404Page />,
		},
		{
			path: '/admin',
			element: (
				<Admin
					restaurantsData={restaurantData!}
					setRestaurantsData={setRestaurantData}
				/>
			),
		},
		{
			path: '/admin/add_restaurants',
			element: (
				<AddRestaurants
					setRestaurantsData={setRestaurantData}
					restaurantsData={restaurantData}
				/>
			),
		},
	])

	return <RouterProvider router={router} />
}
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Main />
	</StrictMode>
)
