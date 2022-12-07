import React from 'react';
import Header from '../../../components/header/Header';
import Card from '../../../components/card/Card';
import style from './dashboard.module.css';

const Dashboard = () => {
	const opdrachten = [
		{ id: '1', titel: 'Deel 1', beschrijving: 'Insert alle data in de file' },
		{ id: '2', titel: 'Deel 2', beschrijving: 'Insert alle studenten data in website' },
		{ id: '3', titel: 'Deel 3', beschrijving: 'Verwijder alle opgaven' },
		{ id: '4', titel: 'Deel 4', beschrijving: 'Geef alle studenten' },
	];
	const vakNaam = '<Web 3>';
	return (
		<main className={style.main}>
			<Header
				title='Host Dashboard'
				name='host stan'
			/>
			<h1 className={style.title}>{vakNaam}</h1>
			{opdrachten.map((opdracht, index) => {
				return (
					<Card
						to={`/host/opdracht/${opdracht.id}`}
						opdracht={opdracht}
						key={index}
					/>
				);
			})}
		</main>
	);
};

export default Dashboard;
