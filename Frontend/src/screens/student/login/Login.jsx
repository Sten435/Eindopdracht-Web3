import { Button, InputText } from '../../../components';
import style from './login.module.css';

const Login = () => {
	return (
		<main className={style.main}>
			<h1>Student Login</h1>
			<div className={style.formContainer}>
				<div className={style.emailContainer}>
					<label
						className={style.label}
						htmlFor='email'>
						Email:
					</label>
					<InputText placeholder='Enter your email' />
				</div>
				<div className={style.pincodeContainer}>
					<label
						className={style.label}
						htmlFor='pincode'>
						Pincode:
					</label>
					<InputText
						placeholder='Enter your pincode'
						maxLength={10}
					/>
				</div>
				<div className={style.loginContainer}>
					<Button
						text='Login'
						style={{ padding: '.4rem 1.4rem', fontSize: '1.6rem', marginTop: '1.4rem' }}
						to='/student/dashboard'
					/>
				</div>
			</div>
		</main>
	);
};

export default Login;
