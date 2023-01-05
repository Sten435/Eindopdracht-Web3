import { useEffect, useRef, useState } from 'react';
import { FaClock, FaHandPaper, FaLock, FaLockOpen, FaPlusSquare } from 'react-icons/fa';
import { HiRefresh } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/button/Button.jsx';
import CountdownTimer from '../../../components/counter/CountdownTimer.jsx';
import Header from '../../../components/header/Header.jsx';
import Rapport from '../../../components/rapport/Rapport.jsx';
import Section from '../../../components/section/Section.jsx';
import Fetch from '../../../controller/fetch.js';
import LoadPage from '../../../controller/loadPage.js';
import { socket } from '../../../controller/socket.js';

const OpdrachtElement = () => {
	const { id: opdrachtId } = useParams();
	const actieButtonRef = useRef();

	const [isOpdrachtGestart, setIsOpdrachtGestart] = useState(false);
	const [isTijdAfgelopen, setIsTijdAfgelopen] = useState(false);
	const [extraTijdToegestaan, setExtraTijdToegestaan] = useState(false);
	const [gemiddeldeExtraTijd, setGemiddeldeExtraTijd] = useState(0);
	const [timerTijd, setTimerTijd] = useState();

	const navigate = useNavigate();

	const { response, updateScreen, loading, error, user } = LoadPage(`/rapporten/${opdrachtId}`, 'GET');

	const getGemiddeldeExtraTijd = async (opdrachtId) => {
		const result3 = await Fetch(`/opdrachten/extraTijd/${opdrachtId}`, 'GET');
		if (result3.error) return alert(result3.message);

		const { seconden } = result3.result;

		setGemiddeldeExtraTijd(seconden);
		opdrachtenGewijzigd();
	};

	const startOpdracht = async () => {
		const result = await Fetch('/opdrachten/start', 'POST', { opdrachtId: opdrachtId });
		if (result.error) return alert(result.message);

		const result2 = await Fetch(`/rapporten/${opdrachtId}`, 'GET');
		if (result2.error) return alert(result2.message);

		setTimerTijd(result2.opdracht.seconden);
		setIsOpdrachtGestart(true);
		opdrachtenGewijzigd();
	};

	const wijzigKanStudentExtraTijdVragen = async () => {
		const result = await Fetch('/opdrachten/wijzigExtraTijdVragen', 'POST', { opdrachtId: opdrachtId });
		if (result.error) return alert(result.message);

		setExtraTijdToegestaan(!extraTijdToegestaan);
		opdrachtenGewijzigd();
	};

	const voegGemiddeldeExtraTijdToe = async () => {
		const result = await Fetch('/opdrachten/voegExtraTijdToe', 'POST', { opdrachtId: opdrachtId });
		if (result.error) return alert(result.message);

		setTimerTijd(Math.round(result.result * 60 + timerTijd));
		getGemiddeldeExtraTijd(opdrachtId);

		socket.emit('toClient', { opdrachtId, nieuweTijd: Math.round(result.result * 60 + timerTijd), action: 'voegExtraTijdToe' });
	};

	const vraagHulpEvent = async (data) => {
		const { opdrachtId: opdrachtID, userId } = data;
		if (opdrachtID !== opdrachtId) return;

		const result = await Fetch(`/studenten/${userId}`, 'GET');
		if (result.error) return alert(result.message);

		const { student } = result;

		alert(
			<span className='flex justify-center'>
				<p className='p-1 mb-1 bg-yellow-500 rounded font-bold w-fit text-black'>
					{student.voorNaam.toUpperCase()} {student.familieNaam}
				</p>
			</span>,
			{
				position: 'bottom-right',
				autoClose: false,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				theme: 'dark',
				icon: () => (
					<FaHandPaper
						className='text-2xl'
						color='#F1C40F'
					/>
				),
			},
		);
	};

	const addVraagEvent = (data) => {
		const { opdrachtId: opdrachtID } = data;
		if (opdrachtID !== opdrachtId) return;

		updateScreen();
	};

	const addExtraTijdEvent = (data) => {
		const { opdrachtId: opdrachtID } = data;
		if (opdrachtID !== opdrachtId) return;

		updateScreen();
	};

	const wijzigStatusEvent = (data) => {
		const { opdrachtId: opdrachtID } = data;
		if (opdrachtID !== opdrachtId) return;

		updateScreen();
	};

	const opdrachtenGewijzigd = () => {
		socket.emit('toClient', { action: 'refreshData' });
	};

	const removeOpdrachtEvent = (data) => {
		const { opdrachtId: opdrachtID } = data;

		if (opdrachtID !== opdrachtId) return;

		alert('De opdracht is verwijderd door de host');
		navigate('/host/dashboard');
	};

	const herstartOpdracht = async () => {
		const result = await Fetch('/opdrachten/stop', 'POST', { opdrachtId: opdrachtId });
		if (result.error) return alert.error(result.message);

		const result2 = await Fetch(`/rapporten/${opdrachtId}`, 'GET');
		if (result2.error) return alert.error(result2.message);

		setTimerTijd(result2.opdracht.seconden);
		setIsOpdrachtGestart(false);
		opdrachtenGewijzigd();
	};

	useEffect(() => {
		if (!response) return;

		if (response.opdracht.startDatum) setIsOpdrachtGestart(true);
		else setIsOpdrachtGestart(false);

		if (response.opdracht.seconden === 0 && response.opdracht.startDatum != null) setIsTijdAfgelopen(true);
		else setIsTijdAfgelopen(false);

		if (response.opdracht.seconden) setTimerTijd(response.opdracht.seconden);
		else setTimerTijd();

		if (response.opdracht.kanStudentExtraTijdVragen) setExtraTijdToegestaan(true);
		else setExtraTijdToegestaan(false);

		getGemiddeldeExtraTijd(opdrachtId);
	}, [response, opdrachtId]);

	useEffect(() => {
		socket.on('vraagHulp', vraagHulpEvent);
		socket.on('addVraag', addVraagEvent);
		socket.on('startRapport', updateScreen);
		socket.on('wijzigExtraTijd', addExtraTijdEvent);
		socket.on('wijzigStatus', wijzigStatusEvent);
		socket.on('removeOpdracht', removeOpdrachtEvent);
		socket.on('refreshData', updateScreen);

		return () => socket.off();
	}, [response]);

	if (error) {
		alert(error.message);
		navigate('/host/dashboard');
	}

	if (loading) return <h1>Loading...</h1>;

	if (response.error) return alert(response.message);
	const { rapporten, opdracht } = response;

	const titel = opdracht.beschrijving;

	let countDownTimer;
	let isAfgelopen = false;
	if (isOpdrachtGestart && timerTijd) {
		countDownTimer = (
			<span className='text-4xl p-2 mb-4 pr-4 flex items-center text-white bg-gray-700 font-bold rounded'>
				<FaClock
					className='mr-5 ml-2'
					size={30}
				/>
				<CountdownTimer
					seconden={timerTijd}
					onEnd={() => {
						setTimerTijd(null);
						setIsTijdAfgelopen(true);
					}}
				/>
				<HiRefresh
					className='ml-5 p-1 bg-cyan-500 opacity-50 cursor-pointer hover:opacity-100 rounded'
					onClick={herstartOpdracht}
					size={35}
				/>
			</span>
		);
	} else if (isTijdAfgelopen || !timerTijd) {
		countDownTimer = (
			<>
				<div className='text-2xl p-2 pl-2 flex items-center text-white bg-red-500 font-bold rounded'>Tijd is afgelopen</div>
				<HiRefresh
					className='ml-2 p-1 bg-gray-500 text-white opacity-50 cursor-pointer hover:opacity-100 rounded'
					onClick={herstartOpdracht}
					size={50}
				/>
			</>
		);
		isAfgelopen = true;
	}

	let actieButton = null;
	if (!isOpdrachtGestart && !isTijdAfgelopen) {
		actieButton = (
			<Button
				text='Start'
				className='m-0 text-2xl'
				click={startOpdracht}
				referace={actieButtonRef}
			/>
		);
	}

	let extraTijdButton;
	if (extraTijdToegestaan) {
		extraTijdButton = <FaLockOpen />;
	} else {
		extraTijdButton = <FaLock />;
	}

	return (
		<>
			<Header
				title='Host'
				metTerugButton
				name={user.voorNaam + ' ' + user.familieNaam}
			/>
			<div className='mt-10 flex justify-center items-center flex-col'>
				<div className='flex w-80 justify-between'>
					{countDownTimer && <div className='w-full flex justify-center'>{countDownTimer}</div>}
					{actieButton && <div className='w-full flex justify-center'>{actieButton}</div>}
				</div>
				{isOpdrachtGestart && !isAfgelopen && (
					<div className='flex w-80 mt-5 justify-between'>
						<div className='w-full flex justify-center'>
							<div
								className={'text-2xl flex justify-center pb-2 pl-2 w-20 pr-2 pt-2 text-white font-bold cursor-pointer rounded ' + (extraTijdToegestaan ? 'bg-green-500' : 'bg-red-500')}
								onClick={wijzigKanStudentExtraTijdVragen}>
								{extraTijdButton}
							</div>
						</div>
						<div className='w-full flex justify-center'>
							<div className='text-2xl pb-1 pl-2 pr-2 pt-1 flex items-center text-white bg-orange-500 font-bold rounded '>
								<span
									className='text-xl cursor-pointer hover:underline flex justify-center items-center'
									onClick={voegGemiddeldeExtraTijdToe}>
									<FaPlusSquare className='mr-3 ml-1' />
									<i>{gemiddeldeExtraTijd} min</i>
								</span>
							</div>
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
								metSluitIcon
								studentId={rapport.student._id}
								closeAction={updateScreen}
								studentNaam={rapport.student.voorNaam + ' ' + rapport.student.familieNaam}
								status={rapport.status}
								extraTijd={rapport.extraTijd}
								vragen={rapport.vragen}
							/>
						);
					})
				) : (
					<div className='flex justify-center'>
						<h1 className='text-2xl text-center pb-2 pl-2 pr-2 pt-2 mt-5 text-white bg-gray-700 font-bold rounded'>Er zijn nog geen rapporten</h1>
					</div>
				)}
			</Section>
		</>
	);
};

export default OpdrachtElement;
