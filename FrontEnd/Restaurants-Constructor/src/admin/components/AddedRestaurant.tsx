import { AddedRestaurantType } from '../../data'

export default function AddedRestaurant(props: AddedRestaurantType) {
	const { title, description, imgUrl } = props

	return (
		<div
			className='flex w-[500px] h-[150px] bg-gray-400 m-2 p-2 rounded-md '
			id='added-restaurant'
		>
			<div id='text-part' className='w-[350px] '>
				<h1>{title}</h1>
				<p>{description}</p>
			</div>
			<img src={imgUrl} className='w-[150px] rounded-md' />
		</div>
	)
}
