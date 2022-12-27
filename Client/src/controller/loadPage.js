import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Fetch from './fetch';
import axios from 'axios';

const LoadPage = (url = '', method = '', withAuth = true) => {
	const [response, setResponse] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (withAuth) {
					try {
						axios.defaults.withCredentials = true;
						const data = await Fetch('/authenticate', 'GET');
						console.log(data);
						if (!data.loggedIn) {
							if (location.pathname === '/') return;
							return navigate('/logout', { replace: true });
						} else {
							if (location.pathname === '/') return navigate('/student/dashboard');
						}
					} catch (error) {
						console.log(`authenticate: ${error}`);
						return navigate('/logout', { replace: true });
					}
				}

				if (!url && !method) return;
				if (url && !method) throw new Error('Invalid method');
				if (!url && method) throw new Error('Invalid url');

				axios.defaults.withCredentials = true;

				const data = await Fetch(url, method);
				setResponse(data);
				setLoading(false);
			} catch (error) {
				console.log(`fetchData: ${error.message ?? error}`);
				setError(error);
			}
		};
		fetchData();
	}, [url, navigate, withAuth, method, location.pathname]);

	return { response, error, loading };
};

export default LoadPage;
