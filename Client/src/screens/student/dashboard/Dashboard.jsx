import React from 'react';
import Header from '../../../components/header/Header';
import style from './dashboard.module.css';
import LoadPage from '../../../controller/loadPage';
import OpdrachtenLijst from '../../../components/opdrachtenLijst/OpdrachtenLijst';
import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from '../../../controller/socket.js';
import Fetch from '../../../controller/fetch';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
	const location = useLocation();
	const [opdrachten, setOpdrachten] = useState();
	const { response, loading, error } = LoadPage('/opdrachten', 'GET');

	const updateOpdrachteEvent = async (data) => {
		const result = await Fetch('/opdrachten', 'GET');
		setOpdrachten(result.opdrachten);
	};

	useEffect(() => {
		if (location && location.state?.reden) toast.info(location.state?.reden);
	}, []);

	useEffect(() => {
		socket.on('voegExtraTijdToe', updateOpdrachteEvent);
		socket.on('opdrachtGestart', updateOpdrachteEvent);

		return () => socket.off();
	}, [response]);

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading) return <p>Loading...</p>;

	if (response.error) return alert(response.error.message);
	if (!opdrachten) setOpdrachten(response.opdrachten);

	let goedeOpdrachten = {};

	for (const key in opdrachten) {
		if (opdrachten[key].filter((opdracht) => opdracht.status === 'Lopend' || opdracht.status === 'Niet Gestart').length > 0) goedeOpdrachten[key] = opdrachten[key];
	}

	return (
		<main className={style.main}>
			<Header
				title='Student Dashboard'
				name='student stan'
				metTerugButton={false}
			/>
			{!opdrachten && <h1 className='text-4xl text-center mt-5 font-bold'>Er zijn geen opdrachten</h1>}
			{goedeOpdrachten && (
				<OpdrachtenLijst
					opdrachten={goedeOpdrachten}
					type='student'
				/>
			)}
			<ToastContainer />
		</main>
	);
};

export default Dashboard;
