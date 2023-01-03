import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './login.module.css';
import axios from 'axios';
import LoadPage from '../../controller/loadPage';
import Button from '../../components/button/Button';
import InputText from '../../components/inputText/InputText';

const Login = () => {
	const emailRef = useRef();
	const codeRef = useRef();
	const navigate = useNavigate();

	LoadPage();

	const loginRequest = async () => {
		const email = emailRef.current.value;
		const code = codeRef.current.value;

		axios.defaults.withCredentials = true;
		const data = (await axios.post('http://localhost:5000/login', { email, code, withCredentials: true, headers: { 'Content-Type': 'application/json', Accept: 'application/json' } })).data;

		if (!data.error && data.loggedIn === true) {
			navigate('/student/dashboard');
		} else {
			alert(data.message);
		}
	};

	return (
		<main className={style.main}>
			<h1>stan.persoons@student.hogent.be</h1>
			<h1>202182629</h1>
			<div className={style.formContainer}>
				<div className={style.emailContainer}>
					<label
						className={style.label}
						htmlFor='email'>
						Email:
					</label>
					<InputText
						referace={emailRef}
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
						placeholder='Enter your pincode'
					/>
				</div>
				<div className={style.loginContainer}>
					<Button
						click={() => loginRequest()}
						text='Login'
						style={{ padding: '.4rem 1.4rem', fontSize: '1.6rem', marginTop: '1.4rem' }}
					/>
				</div>
			</div>
		</main>
	);
};

export default Login;
