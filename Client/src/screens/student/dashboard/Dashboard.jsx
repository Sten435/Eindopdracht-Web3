import React from 'react';
import Header from '../../../components/header/Header';
import Card from '../../../components/card/Card';
import style from './dashboard.module.css';
import CardGrid from '../../../components/cardGrid/CardGrid';
import LoadPage from '../../../controller/loadPage';

const Dashboard = () => {
	const { response, loading, error } = LoadPage('/opdrachten', 'GET');

	if (error) {
		return <p>Er is iets fout gegaan</p>;
	} else if (loading) {
		return <p>Loading...</p>;
	} else {
		const opdrachten = response['Testdemonstratie SeattleFlights'];

		return (
			<main className={style.main}>
				<Header title="Student Dashboard" name="student stan" metTerugButton={false} />
				<CardGrid>
					{opdrachten.map((opdracht, index) => {
						return <Card to={`/student/opdracht/${opdracht?.id}`} opdracht={opdracht} key={index} />;
					})}
				</CardGrid>
			</main>
		);
	}
};

export default Dashboard;
