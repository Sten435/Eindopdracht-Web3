import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../../controller/fetch';
import Loading from '../loading/Loading';

const Logout = () => {
	const navigation = useNavigate();

	useEffect(() => {
		const logout = async () => {
			localStorage.clear();
			const data = await Fetch('/logout', 'GET', {}, true);
			if (!data.loggedIn) navigation('/');
			else alert('Error logging out');
		};
		logout();
	}, [navigation]);

	return <Loading />;
};

export default Logout;
