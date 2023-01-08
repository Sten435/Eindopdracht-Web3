import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadPage from '../../controller/loadPage';
import Button from '../../components/button/Button';
import InputText from '../../components/inputText/InputText';
import Fetch from '../../controller/fetch';

const Login = () => {
	const emailRef = useRef();
	const codeRef = useRef();
	const navigate = useNavigate();

	LoadPage();

	const loginRequest = async () => {
		const email = emailRef.current.value;
		const code = codeRef.current.value;

		if (email.trim() === '' || code.trim() === '') return alert.error('Gelieve alle velden in te vullen');

		const data = await Fetch('login', 'POST', { email, code });

		if (!data.error && data.loggedIn === true) {
			return navigate('/student/dashboard');
		}
		alert.error(data.message);
	};

	return (
		<main className='flex justify-center items-center'>
			<div className='w-[80%] max-w-[750px]'>
				<div className='flex flex-col justify-center items-start'>
					<label
						className='mb-2 pl-1 text-2xl font-bold'
						htmlFor='email'>
						Email:
					</label>
					<InputText
						referace={emailRef}
						value='stan.persoons@student.hogent.be'
						placeholder='Enter your email'
					/>
				</div>
				<div className='flex flex-col justify-center items-start mt-5'>
					<label
						className='mb-2 pl-1 text-2xl font-bold'
						htmlFor='pincode'>
						Pincode:
					</label>
					<InputText
						referace={codeRef}
						value='202182629'
						placeholder='Enter your pincode'
					/>
				</div>
				<div className='flex justify-center items-center flex-col'>
					<Button
						text='Login'
						click={loginRequest}
						className='text-xl mt-10 mb-5 text-slate-200 bg-gray-800 w-full'
					/>
				</div>
			</div>
			<Button
				to='/import/student'
				className='absolute bottom-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
				Klik hier om accounts toe te voegen
			</Button>
		</main>
	);
};

export default Login;
