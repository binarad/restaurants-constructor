import { CSSProperties, useEffect, useState } from 'react'
import AddedRestaurant from './components/AddedRestaurant'
import Button from '@mui/material/Button'
import { DeleteForever } from '@mui/icons-material'
//import { AddedRestaurantType, fetchedRestaurantsType } from "../data";
import { Link } from 'react-router-dom'
// import useFetch from '../hooks/useFetch'
import { DataType } from '../data'

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
	overflow: 'scroll',
	overflowX: 'hidden',
	scrollbarWidth: 'thin',
	scrollBehavior: 'smooth',
}

export default function Admin(props: DataType) {
	const [isChecked, setIsChecked] = useState<boolean>(false)

	const { restaurantsData, setRestaurantsData } = props
	useEffect(() => {
		const fetchData = async () => {
			const resp = await fetch('http://localhost:1337/shops')
			const respJson = await resp.json()
			setRestaurantsData(respJson)
		}
		fetchData()
	}, [])

	async function deleteRestaurant(restaurantId: number) {
		const resp = await fetch(`http://localhost:1337/shops${restaurantId}`, {
			method: 'DELETE',
		})

		const respJson = await resp.json()
		console.log(respJson)
	}

	const deleteAllRestaurants = () => {
		restaurantsData!.forEach(async restaurant => {
			const resp = await fetch(`http://localhost:1337/shops/${restaurant.id}`, {
				method: 'DELETE',
			})
			const respJson = await resp.json()
			console.log(respJson)
			setRestaurantsData(respJson)
		})
	}

	return (
		<div className='flex justify-start items-center h-full flex-col p-5'>
			<h3 className='text-3xl font-bold m-3'>Admin Panel</h3>
			<div style={AdminPanelStlyes}>
				{restaurantsData ? (
					restaurantsData.length > 0 ? (
						restaurantsData.map((restaurant: any) => (
							<AddedRestaurant
								key={restaurant.id}
								title={restaurant.name}
								description={restaurant.description}
								imgUrl={restaurant.imgUrl}
								isChecked={isChecked}
								setIsChecked={setIsChecked}
							/>
						))
					) : (
						<h1 className='self-center items-center w-[500px] h-[505px] flex justify-center text-3xl font-bold'>
							No restaurants found
						</h1>
					)
				) : (
					<p>Loading...</p>
				)}
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
						onClick={() => deleteRestaurant(1)}
					>
						<DeleteForever />
						DELETE
					</Button>
					<Button
						variant='outlined'
						sx={{
							margin: '5px',
							fontSize: '18px',
						}}
						className='w-[170px] h-[45px] '
						onClick={() => deleteAllRestaurants()}
					>
						<DeleteForever />
						DELETE ALL
					</Button>
				</div>
			</div>
		</div>
	)
}
