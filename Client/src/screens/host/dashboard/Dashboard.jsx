import React from 'react';
import Header from '../../../components/header/Header';
import style from './dashboard.module.css';
import Button from '../../../components/button/Button';
import LoadPage from '../../../controller/loadPage';
import OpdrachtenLijst from '../../../components/opdrachtenLijst/OpdrachtenLijst';

const Dashboard = () => {
	const { response, loading, error } = LoadPage('/opdrachten', 'GET');

	if (error) {
		return <p>Er is iets fout gegaan</p>;
	} else if (loading) {
		return <p>Loading...</p>;
	} else {
		const { opdrachten } = response;
		return (
			<main className={style.main}>
				<Header title="Host Dashboard" name="host stan" metTerugButton={false} />
				<OpdrachtenLijst opdrachten={opdrachten} type="host" />
				<hr style={{ width: '100%' }} />
				<Button to="/import/opdracht">Import Opdrachten CSV</Button>
				<Button to="/import/student">Import Studenten CSV</Button>
			</main>
		);
	}
};

export default Dashboard;
