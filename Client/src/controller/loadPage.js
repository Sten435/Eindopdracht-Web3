import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Fetch from './fetch';
import axios from 'axios';

const LoadPage = (url = '', method = '', withAuth = true) => {
	const [response, setResponse] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	const navigate = useNavigate();
	const location = useLocation();

	const updateScreen = async () => {
		if (!url && !method) return;
		if (url && !method) throw new Error('Invalid method');
		if (!url && method) throw new Error('Invalid url');

		axios.defaults.withCredentials = true;

		const data = await Fetch(url, method);

		if (!data.loggedIn) {
			if (location.pathname === '/') return;
			alert('U bent niet ingelogd. Log in om verder te gaan.');
			return navigate('/logout');
		}

		if (data.error) {
			setError(data.message);
			return alert(data.message);
		}

		setResponse(data);
		return data;
	};

	useEffect(() => {
		fetchData();
	}, [url, navigate, withAuth, method, location.pathname, user]);

	const fetchData = async () => {
		try {
			setLoading(true);
			if (withAuth) {
				try {
					axios.defaults.withCredentials = true;
					const data = await Fetch('/auth', 'GET');
					if (!data.loggedIn) {
						if (location.pathname === '/') return;
						alert('U bent niet ingelogd. Log in om verder te gaan.');
						return navigate('/logout');
					} else {
						if (location.pathname === '/') {
							return navigate('/student/dashboard');
						} else if (!user) setUser({ ...data.user });
					}
				} catch (error) {
					console.log(`authenticate: ${error}`);
					return navigate('/logout');
				}
			}

			if (!url && !method) return;
			if (url && !method) throw new Error('Invalid method');
			if (!url && method) throw new Error('Invalid url');

			axios.defaults.withCredentials = true;

			const data = await Fetch(url, method);
			if (data.error) throw Error(data.message);
			else setResponse(data);
		} catch (error) {
			console.log(`error: ${error.message ?? error}`);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { response, updateScreen, error, loading, user };
};

export default LoadPage;
