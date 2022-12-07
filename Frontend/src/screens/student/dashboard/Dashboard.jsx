import React from 'react';
import Header from '../../../components/header/Header';
import Card from '../../../components/card/Card';
import style from './dashboard.module.css';

const Dashboard = () => {
	const opdrachten = [
		{ id: '1', titel: 'Deel 1', beschrijving: 'Insert alle data in de file', status: 'klaar' },
		{ id: '2', titel: 'Deel 2', beschrijving: 'Insert alle studenten data in website', status: 'bezig' },
		{ id: '3', titel: 'Deel 3', beschrijving: 'Verwijder alle opgaven', status: 'bezig' },
		{ id: '4', titel: 'Deel 4', beschrijving: 'Geef alle studenten', status: 'gestopt' },
	];
	const vakNaam = '<Web 3>';
	return (
		<main className={style.main}>
			<Header />
			<h1 style={{ marginTop: 20, marginBottom: 20 }}>{vakNaam}</h1>
			{opdrachten.map((opdracht, index) => {
				return (
					<Card
						to={`/student/opdracht/${opdracht.id}`}
						opdracht={opdracht}
						key={index}
					/>
				);
			})}
		</main>
	);
};

export default Dashboard;
