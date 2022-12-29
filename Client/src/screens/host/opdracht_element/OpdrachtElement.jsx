import { useParams } from 'react-router-dom';
import { Header, Section } from '../../../components/index.js';
import Rapport from '../../../components/rapport/Rapport.jsx';
import style from './opdrachtElement.module.css';
import LoadPage from '../../../controller/loadPage.js';

const OpdrachtElement = () => {
	const { id: opdrachtId } = useParams();
	const { response, loading, error } = LoadPage(`/rapporten/${opdrachtId}`, 'GET');

	if (error) return <h1>Er is iets fout gegaan</h1>;
	if (loading) return <h1>Loading...</h1>;

	const { rapporten } = response;

	const title = '';

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
					return <Rapport key={index} studentNaam={rapport.student.voorNaam + ' ' + rapport.student.familieNaam} status={rapport.status} extraTijd={rapport.extraMinuten} vragen={rapport.vragen} />;
				})}
			</Section>
		</main>
	);
};

export default OpdrachtElement;
