import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../../controller/fetch';

const Logout = () => {
	const navigation = useNavigate();

	useEffect(() => {
		const logout = async () => {
			const data = await Fetch('/logout', 'GET');
			if (!data.loggedIn) navigation('/');
			else alert('Error logging out');
		};
		logout();
	}, []);

	return <div>Logout</div>;
};

export default Logout;
