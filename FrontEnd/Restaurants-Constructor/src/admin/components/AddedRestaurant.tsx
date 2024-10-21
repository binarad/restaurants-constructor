import React from 'react'

export default function AddedRestaurant() {
	return (
		<div
			className='flex w-[500px] h-[150px] bg-gray-700 m-2 p-2 rounded-md '
			id='added-restaurant'
		>
			<div id='text-part' className='w-[350px] '>
				<h1>Title</h1>
				<hr />
				<p>Desc</p>
			</div>
			<img
				src='https://www.adinainteriors.com.au/latest_projects/wp-content/uploads/2021/06/shop-design-timber.jpg'
				className='w-[150px] rounded-md'
			/>
		</div>
	)
}
