import { Button, TextField } from '@mui/material'
import { CSSProperties, useState } from 'react'

export default function Login() {
	const LoginStyles: CSSProperties = {
		width: '1000px',
		height: '650px',
		background: 'lightgray',
		padding: '15px',
		display: 'flex',
		borderRadius: '20px',
		border: '1px solid gray',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		gap: '10px',
	}

	const correctlogin = 'ILOVEPIVO'
	const correctPassword = 'NIGGA'

	const [login, setLogin] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

	const buttonHandler = () => {
		if (login === correctlogin && password === correctPassword) {
			setIsLoggedIn(true)
		}
	}

	return (
		<div className='flex flex-col w-full h-full justify-center items-center'>
			<div style={LoginStyles}>
				<h1 className='text-5xl font-semibold text-center relative top-[-150px]'>
					Login
				</h1>
				<TextField
					variant='outlined'
					label='Login'
					className='w-[300px]'
					value={login}
					onChange={e => setLogin(e.target.value)}
				/>
				<TextField
					variant='outlined'
					label='Password'
					type='password'
					className='w-[300px]'
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<Button
					variant='contained'
					className='w-[300px] h-[50px] text-3xl '
					sx={{ fontSize: '18px', margin: '10px' }}
					onClick={buttonHandler}
				>
					LOGIN
				</Button>

				{isLoggedIn ? <div>Hello nigga</div> : <div></div>}
			</div>
		</div>
	)
}
//grid grid-rows-5 grid-flow-col col-span-1 row-span-1 gap-0 w-[1000px] h-[650px] bg-slate-300 p-2 rounded-lg border border-slate-400 justify-center items-center '
