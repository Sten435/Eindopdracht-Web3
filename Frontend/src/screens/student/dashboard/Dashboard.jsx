import React from 'react';
import Header from '../header/Header';
import OpdrachtCard from './OpdrachtCard';
import './dashboard.css';

const Dashboard = () => {
	const vakNaam = '<Web 3>';
	return (
		<main>
			<Header />
			<h1 style={{ marginTop: 20, marginBottom: 20 }}>{vakNaam}</h1>
			<OpdrachtCard />
		</main>
	);
};

export default Dashboard;
