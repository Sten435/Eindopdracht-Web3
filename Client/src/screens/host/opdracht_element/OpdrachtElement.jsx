import { FaCheck, FaClock, FaLock, FaLockOpen } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Button, Header, Section } from '../../../components/index.js';
import Rapport from '../../../components/rapport/Rapport.jsx';
import style from './opdrachtElement.module.css';
import LoadPage from '../../../controller/loadPage.js';
import CountdownTimer from '../../../components/counter/CountdownTimer.jsx';
import Fetch from '../../../controller/fetch.js';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

const OpdrachtElement = () => {
	const { id: opdrachtId } = useParams();
	const actieButtonRef = useRef();

	const [isOpdrachtGestart, setIsOpdrachtGestart] = useState(false);
	const [isOpdrachtBeeindigd, setIsOpdrachtGestopt] = useState(false);
	const [isTijdAfgelopen, setIsTijdAfgelopen] = useState(false);
	const [extraTijdToegestaan, setExtraTijdToegestaan] = useState(false);

	const [resterendeTijd, setResterendeTijd] = useState();

	const { response, loading, error } = LoadPage(`/rapporten/${opdrachtId}`, 'GET');

	useEffect(() => {
		if (!response) return;
		if (response.opdracht.startDatum) setIsOpdrachtGestart(true);
		if (response.opdracht.seconden === 0 && response.opdracht.startDatum != null) setIsTijdAfgelopen(true);
		if (response.opdracht.gestoptDoorHost) setIsOpdrachtGestopt(true);
		if (response.opdracht.seconden) setResterendeTijd(response.opdracht.seconden);
		console.log(response.opdracht);
		if (response.opdracht.extraTijdToegestaan) setExtraTijdToegestaan(true);
	}, [response]);

	if (error) return <h1>Er is iets fout gegaan</h1>;
	if (loading) return <h1>Loading...</h1>;

	if (response.error) return alert(response.message);
	const { rapporten, opdracht } = response;

	const titel = opdracht.beschrijving;

	const startOpdracht = () => {
		Fetch('/opdrachten/start', 'POST', { opdrachtId: opdrachtId }).then((result) => {
			if (result.error) return alert(result.message);
			Fetch(`/rapporten/${opdrachtId}`, 'GET').then((result) => {
				if (result.error) return alert(result.message);
				setResterendeTijd(result.opdracht.seconden);
				setIsOpdrachtGestart(true);
			});
		});
	};

	const stopOpdracht = () => {
		Fetch('/opdrachten/stop', 'POST', { opdrachtId: opdrachtId }).then((result) => {
			if (result.error) return alert(result.message);
			setIsOpdrachtGestopt(true);
		});
	};

	let actieButton;
	if (!isOpdrachtGestart && !isTijdAfgelopen) {
		actieButton = (
			<Button
				text='Start'
				className='m-0 ml-2 text-2xl'
				click={startOpdracht}
				referace={actieButtonRef}
			/>
		);
	} else {
		if (!isOpdrachtBeeindigd || isTijdAfgelopen) {
			actieButton = (
				<Button
					text='Beëindig'
					className='m-0 ml-2 text-2xl'
					click={stopOpdracht}
					referace={actieButtonRef}
				/>
			);
		}
	}

	let countDownTimer;
	if (isOpdrachtGestart && !isOpdrachtBeeindigd && resterendeTijd) {
		countDownTimer = (
			<div className='text-2xl pb-1 pl-2 pr-2 pt-1 mr-2 flex items-center text-white bg-cyan-500 font-bold underline rounded-md'>
				<CountdownTimer
					seconden={resterendeTijd}
					onEnd={() => {
						setResterendeTijd(null);
						setIsTijdAfgelopen(true);
					}}
				/>
			</div>
		);
	} else if (isOpdrachtBeeindigd) {
		countDownTimer = <div className='text-2xl pb-1 pl-2 pr-2 mr-2 pt-1 flex items-center text-white bg-cyan-500 font-bold underline rounded-md'>Opdracht is beeindigd</div>;
	} else if (isTijdAfgelopen || !resterendeTijd) {
		countDownTimer = <div className='text-2xl pb-1 pl-2 pr-2 mr-2 pt-1 flex items-center text-white bg-cyan-500 font-bold underline rounded-md'>Tijd is afgelopen</div>;
	}

	return (
		<main className={style.main}>
			<Header
				title='Host Dashboard'
				name='host stan'
			/>
			<div className='flex justify-center items-center flex-col'>
				<div className='flex justify-around'>
					{countDownTimer}
					{actieButton}
				</div>
				{isOpdrachtGestart && !isOpdrachtBeeindigd && (
					<div className='w-80 flex justify-around mt-5 flex-row '>
						<div className={'text-2xl pb-2 pl-2 pr-2 pt-2 text-white font-bold rounded-md ' + (extraTijdToegestaan ? 'bg-green-500' : 'bg-red-500')}>{extraTijdToegestaan ? <FaLockOpen cursor='pointer' /> : <FaLock cursor='pointer' />}</div>
						<div className='text-2xl pb-1 pl-2 pr-2 pt-1 flex items-center text-white bg-orange-500 font-bold rounded-md '>
							<h1 className='text-xl flex justify-center items-center'>
								<FaClock
									className='mr-3 ml-1'
									size={25}
								/>
								<i className='mr-1'>+ 10 Min</i>
							</h1>
						</div>
						<div className='text-2xl pb-2 pl-2 pr-2 pt-2 text-white bg-green-500 font-bold rounded-md '>
							<FaCheck cursor='pointer' />
						</div>
					</div>
				)}
			</div>
			<Section
				noLine
				className='pt-5'>
				<div style={{ textAlign: 'center', marginBottom: '1.2rem', marginTop: '.8rem' }}>
					<h1 className='text-2xl mb-4'>{titel}</h1>
				</div>
				{rapporten?.length > 0 ? (
					rapporten.map((rapport, index) => {
						return (
							<Rapport
								key={index}
								studentNaam={rapport.student.voorNaam + ' ' + rapport.student.familieNaam}
								status={rapport.status}
								extraTijd={rapport.extraMinuten}
								vragen={rapport.vragen}
							/>
						);
					})
				) : (
					<div className='flex justify-center'>
						<h1 className='text-2xl text-center pb-2 pl-2 pr-2 pt-2 mt-5 text-white bg-blue-500 font-bold rounded-md'>Er zijn nog geen rapporten</h1>
					</div>
				)}
			</Section>
		</main>
	);
};

export default OpdrachtElement;
