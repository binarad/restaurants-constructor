import React from 'react'
import { CSSProperties } from 'react'

export default function Admin() {
	const AdminPanelStlyes: CSSProperties = {
		width: '1200px',
		height: '700px',
		backgroundColor: '#E1E1E1',
		border: '1px solid #999999',
		borderRadius: '15px',
		// justifyContent: 'center',
		// alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
	}
	return (
		<div className='flex justify-start items-center h-full flex-col p-5'>
			<h3 className='text-3xl font-bold m-3'>Admin Panel</h3>
			<div style={AdminPanelStlyes}>
				<div
					className='bg-stone-400 w-[800px] h-[500px] self-center mt-2 flex-row flex justify-center rounded-[13px]'
					id='added-restaurants-list'
				>
					<div
						className='flex w-[500px] h-[150px] bg-gray-700 m-2 p-2 '
						id='added-restaurant'
					>
						<div id='text-part' className='w-[350px] '>
							<h1>Title</h1>
							<hr />
							<p>Desc</p>
						</div>
						<img src='#' className='w-[150px]' />
					</div>
				</div>
				<div className='flex w-[400px] relative top-[435px] left-[825px]'>
					<button className='w-[175px] h-[50px] bg-blue-400 rounded-lg flex justify-center items-center font-medium text-md m-[5px] hover:bg-blue-500'>
						ADD RESTAURANT
					</button>
					<button className='w-[175px] h-[50px] bg-red-400 rounded-lg flex justify-center items-center text-md font-medium m-[5px] hover:bg-red-500'>
						DELETE RESTAURANT
					</button>
				</div>
			</div>
		</div>
	)
}
