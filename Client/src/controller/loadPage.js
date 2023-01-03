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

	const updateOpdrachten = async (opdrachtId) => {
		const result = await Fetch(`/rapporten/${opdrachtId}`, 'GET');
		setResponse(result);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				if (withAuth) {
					try {
						axios.defaults.withCredentials = true;
						const data = await Fetch('/auth', 'GET');
						if (!data.loggedIn) {
							if (location.pathname === '/') return;
							return navigate('/logout', { replace: true, reden: 'Uitgelogd' });
						} else {
							if (location.pathname === '/') return navigate('/student/dashboard');
							else if (!user) setUser({ ...data.user });
						}
					} catch (error) {
						console.log(`authenticate: ${error}`);
						return navigate('/logout', { replace: true, reden: 'Uitgelogd' });
					}
				}

				if (!url && !method) return;
				if (url && !method) throw new Error('Invalid method');
				if (!url && method) throw new Error('Invalid url');

				axios.defaults.withCredentials = true;

				const data = await Fetch(url, method);
				setResponse(data);
			} catch (error) {
				console.log(`error: ${error.message ?? error}`);
				setError(error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [url, navigate, withAuth, method, location.pathname, user]);

	return { response, setResponse, updateOpdrachten, error, loading, user };
};

export default LoadPage;
