import { Checkbox } from '@mui/material'

type AddedRestaurantType = {
	id: number
	title: string
	description: string
	imgUrl: string
	checked: boolean
	onChange: (id: number, checked: boolean) => void
}

export default function AddedRestaurant(props: AddedRestaurantType) {
	const { id, title, description, imgUrl, checked, onChange } = props
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
				checked={checked}
				onChange={e => onChange(id, e.target.checked)}
				sx={{
					height: '50px',
					alignSelf: 'center',
				}}
			/>
		</div>
	)
}
