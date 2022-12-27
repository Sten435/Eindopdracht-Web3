import React from 'react';
import Header from '../../../components/header/Header';
import Card from '../../../components/card/Card';
import style from './dashboard.module.css';
import CardGrid from '../../../components/cardGrid/CardGrid';
import LoadPage from '../../../controller/loadPage';

const Dashboard = () => {
	const { response, loading, error } = LoadPage('/opdrachten', 'GET');

	const opdrachten = [
		{ id: '1', titel: 'Deel 1', beschrijving: 'Insert alle data in de file', status: 'klaar' },
		{ id: '2', titel: 'Deel 2', beschrijving: 'Insert alle studenten data in website', status: 'bezig' },
		{ id: '3', titel: 'Deel 3', beschrijving: 'Verwijder alle opgaven', status: 'bezig' },
		{ id: '1', titel: 'Deel 1', beschrijving: 'Insert alle data in de file', status: 'klaar' },
		{ id: '2', titel: 'Deel 2', beschrijving: 'Insert alle studenten data in website', status: 'bezig' },
		{ id: '3', titel: 'Deel 3', beschrijving: 'Verwijder alle opgaven', status: 'bezig' },
		{ id: '1', titel: 'Deel 1', beschrijving: 'Insert alle data in de file', status: 'klaar' },
		{ id: '2', titel: 'Deel 2', beschrijving: 'Insert alle studenten data in website', status: 'bezig' },
		{ id: '3', titel: 'Deel 3', beschrijving: 'Verwijder alle opgaven', status: 'bezig' },
		{ id: '1', titel: 'Deel 1', beschrijving: 'Insert alle data in de file', status: 'klaar' },
		{ id: '2', titel: 'Deel 2', beschrijving: 'Insert alle studenten data in website', status: 'bezig' },
		{ id: '3', titel: 'Deel 3', beschrijving: 'Verwijder alle opgaven', status: 'bezig' },
		{ id: '4', titel: 'Deel 4', beschrijving: 'Geef alle studenten', status: 'gestopt' },
	];
	return (
		<main className={style.main}>
			<Header title="Student Dashboard" name="student stan" />
			<CardGrid>
				{opdrachten.map((opdracht, index) => {
					return <Card to={`/student/opdracht/${opdracht.id}`} opdracht={opdracht} key={index} />;
				})}
			</CardGrid>
		</main>
	);
};

export default Dashboard;
