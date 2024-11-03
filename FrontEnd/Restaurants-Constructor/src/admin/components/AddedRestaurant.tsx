import { AddedRestaurantType } from '../../data'
import { Checkbox } from '@mui/material'
export default function AddedRestaurant(props: AddedRestaurantType) {
	const { title, description, imgUrl, isChecked, setIsChecked } = props
	return (
		<div
			className='flex w-[500px] h-[150px] bg-gray-400 m-2 p-2 rounded-md justify-between'
			id='added-restaurant'
		>
			<div id='text-part' className='w-[300px] '>
				<h1>{title}</h1>
				<p className='h-max'>{description}</p>
			</div>
			<img src={imgUrl} className='w-[150px] rounded-md' />
			{/* <FormControlLabel control={<Checkbox />} /> */}
			<Checkbox
				checked={isChecked}
				onChange={e => setIsChecked(e.target.checked)}
				sx={{
					height: '50px',
					alignSelf: 'center',
				}}
			/>
		</div>
	)
}
