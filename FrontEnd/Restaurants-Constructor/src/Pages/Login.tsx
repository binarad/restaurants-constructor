import { Button, TextField } from '@mui/material'
import { CSSProperties, useState } from 'react'
import { useNavigate } from 'react-router'

export default function Login() {
	const LoginStyles: CSSProperties = {
		width: '400px',
		height: '650px',
		background: '#00000000',
		padding: '50px',
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
	const [isValid, setIsValid] = useState<boolean>(false)

	const navigate = useNavigate()

	const buttonHandler = () => {
		if (login === correctlogin && password === correctPassword) {
			setIsValid(true)
		}

		if (isValid) navigate('/admin')
	}

	return (
		<div className='flex flex-col w-full h-full justify-center items-center'>
			<div style={LoginStyles}>
				<h1 className='text-5xl font-semibold text-center relative top-[-150px]'>
					Login
				</h1>

				<TextField
					variant='standard'
					label='Login'
					className='w-full'
					value={login}
					onChange={e => setLogin(e.target.value)}
				/>

				<TextField
					variant='standard'
					label='Password'
					type='password'
					className='w-full '
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>

				<Button
					variant='contained'
					className=' text-3xl '
					sx={{
						fontSize: '18px',
						margin: '10px',
						height: '40px',
						width: '200px',
					}}
					onClick={buttonHandler}
				>
					LOGIN
				</Button>
			</div>
		</div>
	)
}
//grid grid-rows-5 grid-flow-col col-span-1 row-span-1 gap-0 w-[1000px] h-[650px] bg-slate-300 p-2 rounded-lg border border-slate-400 justify-center items-center '
