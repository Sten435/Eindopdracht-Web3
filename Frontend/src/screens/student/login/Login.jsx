import './login.css';

import { Link } from 'react-router-dom';

const Login = () => {
	return (
		<main>
			<h1>Student Login</h1>
			<div className='formContainer'>
				<div className='emailContainer'>
					<label htmlFor='email'>Email:</label>
					<input
						id='email'
						placeholder='Enter your email'
						type='text'
					/>
				</div>
				<div className='pincodeContainer'>
					<label htmlFor='pincode'>Pincode:</label>
					<input
						id='pincode'
						maxLength={10}
						placeholder='Enter your pincode'
						type='text'
					/>
				</div>
				<Link
					to='/student/dashboard'
					className='linkComponent'>
					<input
						type='submit'
						className='submitButton'
						value='Login'
					/>
				</Link>
			</div>
		</main>
	);
};

export default Login;
