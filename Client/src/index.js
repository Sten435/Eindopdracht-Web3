import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';

window.alert = (
	str,
	options = {
		position: 'bottom-right',
		autoClose: false,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		theme: 'dark',
	},
) => {
	return toast.info(str, options);
};

window.alert.error = (
	str,
	options = {
		position: 'top-center',
		autoClose: false,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		theme: 'dark',
	},
) => {
	return toast.error(
		<b>
			<u>{str}</u>
		</b>,
		options,
	);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
localStorage.setItem('alertId', null);

root.render(
	// <StrictMode>
	<BrowserRouter>
		<ToastContainer />
		<App />
	</BrowserRouter>,
	/* </StrictMode> */
);
