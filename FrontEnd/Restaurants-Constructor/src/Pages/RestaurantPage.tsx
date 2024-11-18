import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Add, Category } from '@mui/icons-material'
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material'

type ShopDataType = {
	id: number
	name: string
	description: string
	imgUrl: string
}

export default function RestaurantPage() {
	const { shopId } = useParams()
	const [data, setData] = useState<ShopDataType | undefined>()

	const [open, setOpen] = useState<boolean>(false)
	const [categoryName, setCategoryName] = useState<string>('')
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	// console.log(shopId)

	const handleCreateCategory = () => {
		console.log('Created new category ', categoryName)
		setCategoryName('')
		setOpen(false)
	}

	useEffect(() => {
		const restaurantData = async () => {
			const response = await fetch(`http://localhost:1337/shops/${shopId}`)
			const restaurantData = await response.json()
			setData(restaurantData)
			console.log(restaurantData)
		}

		restaurantData()
	}, [])
	return (
		<div className='flex flex-col gap-2 h-full  items-center p-10 bg-slate-100'>
			<div className='flex gap-5 items-center w-[700px] justify-center  '>
				<img src={data?.imgUrl} className='h-[150px] w-[150px] rounded-full' />
				<div className='flex flex-col gap-5 w-[500px]'>
					<h1 className='text-2xl'>{data?.name}</h1>
					<p className='text-base flex-wrap'>{data?.description}</p>
				</div>
			</div>
			<button
				className='flex w-[350px] h-[75px] items-center justify-center border-dashed border-black border-2 rounded-md text-lg mt-[120px] gap-1 font-semibold'
				onClick={handleOpen}
			>
				Create category <Add />
			</button>

			<Dialog
				open={open}
				onClose={handleClose}
				sx={{
					width: '600px',
					height: '500px',
					alignSelf: 'center',
					justifySelf: 'center',
				}}
			>
				<DialogTitle>Create new category</DialogTitle>
				<DialogContent
					className='w-full h-full'
					sx={{
						width: '500px',
						height: '400px',
					}}
				>
					<TextField
						autoFocus
						margin='dense'
						label='Category name'
						type='text'
						fullWidth
						value={categoryName}
						onChange={e => setCategoryName(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button variant='outlined' onClick={handleClose}>
						Cancel
					</Button>
					<Button variant='contained' onClick={handleCreateCategory}>
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
