import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
export default function Error404Page() {
	return (
		<div className='flex h-full justify-center items-center flex-col text-3xl gap-2'>
			<h1>Error 404</h1>
			<h2>Page not found</h2>
			<Button
				variant='contained'
				size='medium'
				sx={{
					width: '250px',
					height: '50px',
				}}
			>
				<Link to='/'>Go Home</Link>
			</Button>
		</div>
	)
}
