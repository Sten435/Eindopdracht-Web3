import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/header/Header';
import LoadPage from '../../../controller/loadPage';

const Groep = () => {
	const { loading, error, user } = LoadPage();
	const navigate = useNavigate();

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading) return <p>Loading...</p>;

	console.log(user);

	return (
		<>
			<main>
				<Header
					title='Admin Opdracht'
					name={user.voorNaam + ' ' + user.familieNaam}
				/>
			</main>
		</>
	);
};

export default Groep;
