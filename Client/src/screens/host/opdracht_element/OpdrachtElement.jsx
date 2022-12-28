import { useParams } from 'react-router-dom';
import { Header, Section } from '../../../components/index.js';
import Rapport from '../../../components/rapport/Rapport.jsx';
import style from './opdrachtElement.module.css';

const OpdrachtElement = () => {
	const { id: opdrachtId } = useParams();

	const rapporten = [
		{
			studentNaam: 'Stan Persoons',
			status: 'Klaar',
			extraTijd: '10',
			vragen: ['Ik heb een vraag voor de docent', 'Ik heb een vraag voor de medestudenten'],
		},
		{
			studentNaam: 'Weude De Crop',
			status: 'Bezig',
			extraTijd: '15',
			vragen: ['Ik heb een vraag voor de docent', 'Ik heb een vraag voor de medestudenten'],
		},
	];

	const title = 'Deel ' + opdrachtId;

	return (
		<main className={style.main}>
			<Header title="Host Dashboard" name="host stan" />
			<Section noLine>
				<div style={{ textAlign: 'center', marginBottom: '1.2rem', marginTop: '.8rem' }}>
					<h1 className={style.title}>{title}</h1>
					<hr />
					<h2>1u 16m 12s</h2>
				</div>
				{rapporten.map((rapport, index) => {
					return <Rapport key={index} studentNaam={rapport.studentNaam} status={rapport.status} extraTijd={rapport.extraTijd} vragen={rapport.vragen} />;
				})}
			</Section>
		</main>
	);
};

export default OpdrachtElement;
