import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Admin from './admin/Admin.tsx'
import AddRestaurants from './Pages/AddRestaurants.tsx'

const router = createBrowserRouter([
	{
		path: '/admin',
		element: <Admin />,
	},
	{
		path: '/admin/add_restaurants',
		element: <AddRestaurants />,
	},
])

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
