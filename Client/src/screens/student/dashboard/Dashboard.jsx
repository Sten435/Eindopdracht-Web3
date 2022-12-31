import React from 'react';
import Header from '../../../components/header/Header';
import style from './dashboard.module.css';
import LoadPage from '../../../controller/loadPage';
import OpdrachtenLijst from '../../../components/opdrachtenLijst/OpdrachtenLijst';

const Dashboard = () => {
	const { response, loading, error } = LoadPage('/opdrachten', 'GET');

	if (error) {
		return <p>Er is iets fout gegaan</p>;
	} else if (loading) {
		return <p>Loading...</p>;
	} else {
		if (response.error) return alert(response.error.message);
		const { opdrachten } = response;

		return (
			<main className={style.main}>
				<Header
					title='Student Dashboard'
					name='student stan'
					metTerugButton={false}
				/>
				{!opdrachten && <h1 className='text-4xl text-center mt-5 font-bold'>Er zijn geen opdrachten</h1>}
				{opdrachten && (
					<OpdrachtenLijst
						opdrachten={opdrachten}
						type='student'
					/>
				)}
			</main>
		);
	}
};

export default Dashboard;
