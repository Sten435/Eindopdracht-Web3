import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from './fetch';
import axios from 'axios';

const LoadPage = (url = '', method = '', withAuth = true) => {
	const [response, setResponse] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (withAuth) {
					try {
						axios.defaults.withCredentials = true;
						const data = await Fetch('/authenticate', 'GET');
						if (!data.loggedIn) {
							return navigate('/', { replace: true });
						}
					} catch (error) {
						console.log(`authenticate: ${error}`);
						return navigate('/', { replace: true });
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
	}, [url, navigate, withAuth, method]);

	return { response, error, loading };
};

export default LoadPage;
