import React from 'react';
import Section from '../section/Section';
import Card from '../card/Card';

const OpdrachtenLijst = ({ opdrachten, type }) => {
	let opdrachtenLijst = [];
	for (const key in opdrachten) {
		opdrachtenLijst.push(
			<Section
				title={key}
				noLine
				key={key}>
				{opdrachten[key].map((opdracht, index) => {
					if (type === 'student' && (opdracht.status === 'Beeindigd' || opdracht.status === 'Afgelopen')) return;
					return (
						<Card
							to={`/${type}/opdracht/${opdracht.id}`}
							opdracht={opdracht}
							key={key + index}
						/>
					);
				})}
			</Section>,
		);
	}

	return opdrachtenLijst;
};

export default OpdrachtenLijst;
