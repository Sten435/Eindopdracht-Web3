import React from 'react';
import './opdrachtCard.css';

const OpdrachtCard = () => {
	const opdrachten = [
		{ titel: 'Deel 1', beschrijving: 'Insert alle data in de file', status: 'klaar' },
		{ titel: 'Deel 2', beschrijving: 'Insert alle studenten data in website', status: 'bezig' },
		{ titel: 'Deel 3', beschrijving: 'Verwijder alle opgaven', status: 'bezig' },
		{ titel: 'Deel 4', beschrijving: 'Geef alle studenten', status: 'gestopt' },
	];

	return opdrachten.map(({ titel, beschrijving, status }, index) => {
		return (
			<div
				className='card'
				key={index}>
				<b>
					<h2>{titel}</h2>
					<p>{beschrijving}</p>
				</b>
				<span className={'statusContainer ' + status}>{status.toLocaleUpperCase()}</span>
			</div>
		);
	});
};

export default OpdrachtCard;
