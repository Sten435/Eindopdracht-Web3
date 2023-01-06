import React, { useEffect } from 'react';
import Header from '../../../components/header/Header';
import OpdrachtenLijst from '../../../components/opdrachtenLijst/OpdrachtenLijst';
import LoadPage from '../../../controller/loadPage';
import { socket } from '../../../controller/socket';
import Loading from '../../loading/Loading';

const Dashboard = () => {
	const { response, updateScreen, loading, error, user } = LoadPage('/opdrachten', 'GET');

	const removeOpdrachtEvent = (data) => {
		alert('Er is een opdracht verwijderd door host');
		updateScreen();
	};

	useEffect(() => {
		socket.on('removeOpdracht', removeOpdrachtEvent);
		socket.on('refreshData', updateScreen);

		return () => socket.off();
	}, [response]);

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading) return <Loading />;
	if (response.error) return alert.error(response.message);

	const { opdrachten } = response;

	return (
		<>
			<Header
				title='Host'
				metLogoutButton
				name={user.voorNaam + ' ' + user.familieNaam}
			/>
			{opdrachten && Object.keys(opdrachten).length > 0 ? (
				<OpdrachtenLijst
					opdrachten={opdrachten}
					type='host'
				/>
			) : (
				<h2 className='mt-10 mb-2 text-center text-gray-700 font-bold text-2xl'>Nog geen opdrachten</h2>
			)}
		</>
	);
};

export default Dashboard;
