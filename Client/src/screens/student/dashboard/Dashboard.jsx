import React, { useEffect } from 'react';

import Header from '../../../components/header/Header';
import OpdrachtenLijst from '../../../components/opdrachtenLijst/OpdrachtenLijst';
import LoadPage from '../../../controller/loadPage';

import { socket } from '../../../controller/socket.js';
import Loading from '../../loading/Loading';

const Dashboard = () => {
	const { response, updateScreen, loading, error, user } = LoadPage('/opdrachten', 'GET');

	const removeOpdrachtEvent = ({ adminOnly }) => {
		if (adminOnly === false) alert('Er is een opdracht verwijderd door host');
	};

	useEffect(() => {
		socket.on('removeOpdracht', removeOpdrachtEvent);
		socket.on('refreshData', updateScreen);

		return () => socket.off();
	}, []);

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading) return <Loading />;
	if (response.error) return alert(response.error.message);

	const { opdrachten } = response;

	let goedeOpdrachten = {};

	for (const key in opdrachten) {
		opdrachten[key].forEach((opdracht) => {
			if (opdracht.status.toLowerCase() === 'lopend') {
				if (!goedeOpdrachten[key]) goedeOpdrachten[key] = [];
				goedeOpdrachten[key].push(opdracht);
			}
		});
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
				<h1 className='mt-10 mb-2 text-center text-gray-700 font-bold text-2xl'>Nog geen opdrachten</h1>
			)}
		</>
	);
};

export default Dashboard;
