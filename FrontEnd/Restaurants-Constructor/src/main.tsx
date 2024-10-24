import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Admin from './admin/Admin.tsx'
import AddRestaurants from './Pages/AddRestaurants.tsx'
import Error404Page from './Pages/Error404Page.tsx'

const Main = () => {
	const [title, setTitle] = useState<string | null>(null)
	const [description, setDescription] = useState<string | null>(null)
	const [imgUrl, setImgUrl] = useState<string | null>(null)

	const router = createBrowserRouter([
		{
			path: '/',
			element: <App />,
			errorElement: <Error404Page />,
		},
		{
			path: '/admin',
			element: (
				<Admin title={title!} description={description!} imgUrl={imgUrl!} />
			),
		},
		{
			path: '/admin/add_restaurants',
			element: (
				<AddRestaurants
					title={title!}
					setTitle={setTitle!}
					description={description!}
					setDescription={setDescription}
					imgUrl={imgUrl!}
					setImgUrl={setImgUrl!}
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
