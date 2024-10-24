import { TextField, Button } from '@mui/material'
import { AddRestaurantType } from '../data'
import { Link } from 'react-router-dom'

export default function AddRestaurants(props: AddRestaurantType) {
	const { title, setTitle, description, setDescription, imgUrl, setImgUrl } =
		props
	// const [imgUrl, setImgUrl] = useState<string>()
	const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'] // Allowed file types for restaurant icon

	const AddToDB = async (name: string, description: string, imgUrl: string) => {
		const data = await fetch(
			`http://localhost:1337/goods/add?id=1&name=${name}&description=${description}&price=1&imgUrl=${encodeURIComponent(
				imgUrl
			)}`
		)
		const jsonData = await data.json()
		console.log(jsonData)
		alert('Successfully added')
	}

	const PrintDB = async () => {
		const data = await fetch('http://localhost:1337/goods/print')
		const jsonData = await data.json()
		console.log(jsonData)
	}
	return (
		<div
			id='add-restaurant-container'
			className='flex justify-center items-center h-full'
		>
			<div className='w-[1200px] h-[700px] bg-slate-100 rounded-[20px] flex items-center justify-center border-slate-300 border-2 flex-col gap-3'>
				<TextField
					required
					label='Restaurant name'
					variant='outlined'
					autoComplete='off'
					onChange={e => {
						e.preventDefault()
						setTitle(e.target.value)
					}}
					value={title || ''}
					sx={{ width: '300px', fontSize: '18px', m: '5px' }}
				/>
				<TextField
					required
					multiline
					variant='outlined'
					autoComplete='off'
					onChange={e => {
						e.preventDefault()
						setDescription(e.target.value)
					}}
					value={description}
					label='Restaurant description'
					sx={{ width: '300px', fontSize: '18px', m: '5px' }}
				/>
				<img
					src={imgUrl}
					className='w-[300px] h-[300px] rounded-lg object-cover border-none'
				/>
				<Button variant='contained'>
					<label htmlFor='restaurant-icon-input'>Click to upload photo</label>
				</Button>
				<input
					style={{ display: 'none' }}
					type='file'
					name='restaurant-icon-input'
					id='restaurant-icon-input'
					onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
						e.preventDefault()
						if (e.target.files && e.target.files[0]) {
							const file = e.target.files[0]

							const formData = new FormData()
							formData.append('file', file)
							// setImgUrl(formData)
							setImgUrl(URL.createObjectURL(e.target.files![0]))
						}
						// if (e.target.files![0].type === allowedFileTypes.join(','))
						// 	alert('Not Allowed Type')
						// else setImgUrl(URL.createObjectURL(e.target.files![0]))
					}}
					width={300}
					height={300}
					accept={allowedFileTypes.join(',')}
				/>
				<Button
					variant='contained'
					sx={{ width: '100px' }}
					onClick={() => {
						AddToDB(title, description, imgUrl)
						PrintDB()
					}}
				>
					<Link to='/admin'>Add</Link>
				</Button>
			</div>
		</div>
	)
}
