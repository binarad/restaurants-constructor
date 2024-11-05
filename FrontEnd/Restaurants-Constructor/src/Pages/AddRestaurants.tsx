import { TextField, Button } from '@mui/material'
// import { AddRestaurantType } from '../data'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { DataType } from '../data'

export default function AddRestaurants(props: DataType) {
	const setRestaurantsData = props.setRestaurantsData

	const [title, setTitle] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	// const [imgUrl, setImgUrl] = useState<string | null>(null)

	const [previewImg, setPreviewImg] = useState<string>('')
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'] // Allowed file types for restaurant icon

	//upload img to server
	const uploadImg = async (file: File): Promise<string | null> => {
		try {
			const imgForm = new FormData()
			imgForm.append('image', file)

			const resp = await fetch('http://localhost:1337/images', {
				method: 'POST',
				// mode: 'no-cors',
				// headers: {
				// 	'Access-Control-Allow-Origin': '*',
				// },
				body: imgForm,
			})

			if (!resp.ok) {
				console.error('Failed to upload image.')
				return null
			}

			const respJSON = await resp.json()
			return respJSON.link
		} catch (error) {
			console.error('Something unexpected happened: ', error)
			return null
		}
	}

	// Add restaurant to db
	const addRestaurant = async () => {
		try {
			if (selectedFile) {
				const imageLink = await uploadImg(selectedFile!)

				if (!imageLink) {
					console.error('Failed to upload image.')
					return
				}
				const RestaurantData = {
					name: title,
					description: description,
					imgUrl: imageLink,
				}
				const goodsResponse = await fetch('http://localhost:1337/shops', {
					method: 'POST',
					mode: 'no-cors',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
					body: JSON.stringify(RestaurantData),
				})

				const newRestaurant = await goodsResponse.json()
				setRestaurantsData(prevData => [...prevData, newRestaurant])
			} else {
				console.error('No image file selected')
			}
		} catch (error) {
			console.error(`Unexpected error while adding restaurant: ${error}`)
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]

			if (allowedFileTypes.includes(file.type)) {
				setSelectedFile(file)
				setPreviewImg(URL.createObjectURL(file))
			} else {
				alert('Please upload a valid image file')
			}
		}
	}
	const PrintRestaurants = async () => {
		const data = await fetch('http://localhost:1337/shops')
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
					onChange={e => setTitle(e.target.value)}
					value={title}
					sx={{ width: '300px', fontSize: '18px', m: '5px' }}
				/>
				<TextField
					required
					multiline
					variant='outlined'
					autoComplete='off'
					onChange={e => setDescription(e.target.value)}
					value={description}
					label='Restaurant description'
					sx={{ width: '300px', fontSize: '18px', m: '5px' }}
				/>
				<img
					src={previewImg}
					className='w-[300px] h-[300px] rounded-lg object-cover border-none'
				/>
				<Button variant='contained' sx={{ fontSize: '18px' }}>
					<label htmlFor='restaurant-icon-input'>Click to upload photo</label>
				</Button>
				<input
					style={{ display: 'none' }}
					type='file'
					name='restaurant-icon-input'
					id='restaurant-icon-input'
					onChange={handleFileChange}
					accept={allowedFileTypes.join(',')}
				/>
				<div className=' w-[250px] justify-between flex'>
					<Link to='/admin'>
						<Button
							variant='contained'
							sx={{ width: '100px', fontSize: '18px' }}
							onClick={() => {
								addRestaurant()
								PrintRestaurants()
							}}
						>
							Add
						</Button>
					</Link>
					<Link to='/admin'>
						<Button
							variant='outlined'
							sx={{ width: '100px', fontSize: '18px' }}
						>
							Cancel
						</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}
