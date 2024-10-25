import { CSSProperties, useState } from 'react'
import AddedRestaurant from './components/AddedRestaurant'
import Button from '@mui/material/Button'
import { DeleteForever } from '@mui/icons-material'
import { AddedRestaurantType } from '../data'
import { Link } from 'react-router-dom'

const AdminPanelStlyes: CSSProperties = {
	width: '1200px',
	height: '700px',
	backgroundColor: '#E1E1E1',
	border: '1px solid #999999',
	borderRadius: '15px',
	justifyContent: 'center',
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'column',
}

export default function Admin(props: AddedRestaurantType) {
	// const { title, description, imgUrl } = props

	const [title, setTitle] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	const [imgUrl, setImgUrl] = useState<string>('')

	const fetchData = async () => {
		const data = await fetch('http://localhost:1337/goods/read{id}')
		const jsonData = await data.json()
		console.log(jsonData)
		setTitle(jsonData[2].name)
		setDescription(jsonData[2].description)
		setImgUrl(jsonData[2].imgUrl)
	}
	fetchData()
	return (
		<div className='flex justify-start items-center h-full flex-col p-5'>
			<h3 className='text-3xl font-bold m-3'>Admin Panel</h3>
			<div style={AdminPanelStlyes}>
				<AddedRestaurant
					title={title}
					description={description}
					imgUrl={imgUrl}
				/>
				<div
					id='buttons'
					className='flex w-full mt-auto  mb-1 mr-1 items-center justify-end'
				>
					<Link to='/admin/add_restaurants'>
						<Button
							variant='contained'
							className='w-[100px] h-[45px] '
							sx={{
								margin: '5px',
								fontSize: '18px',
							}}
						>
							ADD
						</Button>
					</Link>
					<Button
						variant='outlined'
						sx={{
							margin: '5px',
							fontSize: '18px',
						}}
						className='w-[170px] h-[45px] '
					>
						<DeleteForever />
						DELETE
					</Button>
				</div>
			</div>
		</div>
	)
}
