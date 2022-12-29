import React from 'react';
import Section from '../section/Section';
import Card from '../card/Card';

const OpdrachtenLijst = ({ opdrachten, type }) => {
	let opdrachtenLijst = [];
	for (const key in opdrachten) {
		opdrachtenLijst.push(
			<Section title={key} key={key}>
				{opdrachten[key].map((opdracht, index) => {
					return <Card to={`/${type}/opdracht/${opdracht.id}`} opdracht={opdracht} key={key + index} />;
				})}
			</Section>
		);
	}

	return opdrachtenLijst;
};

export default OpdrachtenLijst;
