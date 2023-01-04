import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../../../components/header/Header';
import OpdrachtenLijst from '../../../components/opdrachtenLijst/OpdrachtenLijst';
import LoadPage from '../../../controller/loadPage';

import { socket } from '../../../controller/socket.js';

const Dashboard = () => {
	const location = useLocation();
	const { response, updateScreen, loading, error, user } = LoadPage('/opdrachten', 'GET');

	const checkAlerts = () => {
		if (!location) return;
		const alertId = location.key;

		if (alertId === sessionStorage.getItem('alertId')) return;
		else sessionStorage.setItem('alertId', alertId);

		if (location.state?.reden) alert(location.state?.reden);
	};

	useEffect(() => {
		checkAlerts();

		socket.on('refreshData', updateScreen);

		return () => socket.off();
	}, []);

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading) return <p>Loading...</p>;
	if (response.error) return alert(response.error.message);

	const { opdrachten } = response;

	let goedeOpdrachten = {};

	for (const key in opdrachten) {
		if (opdrachten[key].filter((opdracht) => opdracht.status === 'Lopend' || opdracht.status === 'Niet Gestart').length > 0) goedeOpdrachten[key] = opdrachten[key];
	}

	return (
		<>
			<Header
				title='Student'
				metLogoutButton
				name={user.voorNaam + ' ' + user.familieNaam}
			/>
			{goedeOpdrachten && Object.keys(goedeOpdrachten).length > 0 ? (
				<OpdrachtenLijst
					opdrachten={goedeOpdrachten}
					type='student'
				/>
			) : (
				<h2 className='mt-10 mb-2 text-center text-gray-700 font-bold text-2xl'>Nog geen opdrachten</h2>
			)}
		</>
	);
};

export default Dashboard;
