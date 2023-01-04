import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './login.module.css';
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
		<main className={style.main}>
			<div className={style.formContainer}>
				<div className={style.emailContainer}>
					<label
						className={style.label}
						htmlFor='email'>
						Email:
					</label>
					<InputText
						referace={emailRef}
						value='stan.persoons@student.hogent.be'
						placeholder='Enter your email'
					/>
				</div>
				<div className={style.pincodeContainer}>
					<label
						className={style.label}
						htmlFor='pincode'>
						Pincode:
					</label>
					<InputText
						referace={codeRef}
						value='202182629'
						placeholder='Enter your pincode'
					/>
				</div>
				<div className={style.loginContainer}>
					<Button
						text='Maak'
						click={loginRequest}
						className='text-xl mt-10 mb-5 text-slate-200 bg-gray-800 w-full'
					/>
				</div>
			</div>
		</main>
	);
};

export default Login;
