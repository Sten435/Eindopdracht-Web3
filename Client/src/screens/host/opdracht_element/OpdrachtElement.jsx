import { FaCheck, FaClock, FaLock } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Button, Header, Section } from '../../../components/index.js';
import Rapport from '../../../components/rapport/Rapport.jsx';
import style from './opdrachtElement.module.css';
import LoadPage from '../../../controller/loadPage.js';
import CountdownTimer from '../../../components/counter/CountdownTimer.jsx';

const OpdrachtElement = () => {
	const { id: opdrachtId } = useParams();
	const { response, loading, error } = LoadPage(`/rapporten/${opdrachtId}`, 'GET');

	if (error) return <h1>Er is iets fout gegaan</h1>;
	if (loading) return <h1>Loading...</h1>;

	const { rapporten, opdracht } = response;

	const titel = opdracht.beschrijving;
	const tijd = opdracht.seconden;

	return (
		<main className={style.main}>
			<Header title="Host Dashboard" name="host stan" />
			<div className="flex justify-center items-center flex-col">
				<div className="w-80 flex justify-around">
					<h2 className="text-2xl pb-1 pl-2 pr-2 pt-1 flex items-center text-white bg-cyan-500 font-bold underline rounded-md ">
						<CountdownTimer seconden={tijd} />
					</h2>
					<Button text="Stop" className="m-0 text-2xl" />
				</div>
				<div className="w-80 flex justify-around mt-5 flex-row ">
					<div className="text-2xl pb-2 pl-2 pr-2 pt-2 text-white bg-red-500 font-bold rounded-md">
						<FaLock cursor="pointer" />
					</div>
					<div className="text-2xl pb-1 pl-2 pr-2 pt-1 flex items-center text-white bg-orange-500 font-bold rounded-md ">
						<h1 className="text-xl flex justify-center items-center">
							<FaClock className="mr-3 ml-1" size={25} />
							<i className="mr-1">+ 10 Min</i>
						</h1>
					</div>
					<div className="text-2xl pb-2 pl-2 pr-2 pt-2 text-white bg-green-500 font-bold rounded-md ">
						<FaCheck cursor="pointer" />
					</div>
				</div>
			</div>
			<Section noLine className="pt-5">
				<div style={{ textAlign: 'center', marginBottom: '1.2rem', marginTop: '.8rem' }}>
					<h1 className="text-2xl mb-4">{titel}</h1>
				</div>
				{rapporten?.length > 0 ? (
					rapporten.map((rapport, index) => {
						return <Rapport key={index} studentNaam={rapport.student.voorNaam + ' ' + rapport.student.familieNaam} status={rapport.status} extraTijd={rapport.extraMinuten} vragen={rapport.vragen} />;
					})
				) : (
					<div className="flex justify-center">
						<h1 className="text-2xl text-center pb-2 pl-2 pr-2 pt-2 mt-5 text-white bg-blue-500 font-bold rounded-md">Er zijn nog geen rapporten</h1>
					</div>
				)}
			</Section>
		</main>
	);
};

export default OpdrachtElement;
