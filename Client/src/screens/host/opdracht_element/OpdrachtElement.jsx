import { FaHandPaper, FaLock, FaLockOpen, FaPlusSquare } from 'react-icons/fa';
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
import { ToastContainer, toast } from 'react-toastify';
import { socket } from '../../../controller/socket.js';
import 'react-toastify/dist/ReactToastify.css';

const OpdrachtElement = () => {
	const { id: opdrachtId } = useParams();
	const actieButtonRef = useRef();

	const [isOpdrachtGestart, setIsOpdrachtGestart] = useState(false);
	const [isOpdrachtBeeindigd, setIsOpdrachtGestopt] = useState(false);
	const [isTijdAfgelopen, setIsTijdAfgelopen] = useState(false);
	const [extraTijdToegestaan, setExtraTijdToegestaan] = useState(false);
	const [gemiddeldeExtraTijd, setGemiddeldeExtraTijd] = useState(0);
	const [timerTijd, setTimerTijd] = useState();

	const { response, setResponse, loading, error, user } = LoadPage(`/rapporten/${opdrachtId}`, 'GET');

	const getGemiddeldeExtraTijd = async (opdrachtId) => {
		const result3 = await Fetch(`/opdrachten/extraTijd/${opdrachtId}`, 'GET');
		if (result3.error) return alert(result3.message);

		const { seconden } = result3.result;

		setGemiddeldeExtraTijd(seconden);
	};

	const startOpdracht = async () => {
		const result = await Fetch('/opdrachten/start', 'POST', { opdrachtId: opdrachtId });
		if (result.error) return alert(result.message);

		const result2 = await Fetch(`/rapporten/${opdrachtId}`, 'GET');
		if (result2.error) return alert(result2.message);

		socket.emit('toClient', { opdrachtId, action: 'opdrachtGestart' });

		setTimerTijd(result2.opdracht.seconden);
		setIsOpdrachtGestart(true);
	};

	const stopOpdracht = async () => {
		const result = await Fetch('/opdrachten/stop', 'POST', { opdrachtId: opdrachtId });
		if (result.error) return alert(result.message);

		socket.emit('toClient', { opdrachtId, action: 'stopOpdracht' });
		setIsOpdrachtGestopt(true);
	};

	const wijzigKanStudentExtraTijdVragen = async () => {
		const result = await Fetch('/opdrachten/wijzigExtraTijdVragen', 'POST', { opdrachtId: opdrachtId });
		if (result.error) return alert(result.message);

		socket.emit('toClient', { opdrachtId, extraTijdToegestaan: !extraTijdToegestaan, action: 'wijzigKanStudentExtraTijdVragen' });
		setExtraTijdToegestaan(!extraTijdToegestaan);
	};

	const voegGemiddeldeExtraTijdToe = async () => {
		const result = await Fetch('/opdrachten/voegExtraTijdToe', 'POST', { opdrachtId: opdrachtId });
		if (result.error) return alert(result.message);

		setTimerTijd(Math.round(result.result * 60 + timerTijd));
		getGemiddeldeExtraTijd(opdrachtId);

		socket.emit('toClient', { opdrachtId, nieuweTijd: Math.round(result.result * 60 + timerTijd), action: 'voegExtraTijdToe' });
	};

	const vraagHulpEvent = (data) => {
		const { opdrachtId: opdrachtID } = data;
		if (opdrachtID !== opdrachtId) return;

		const students = response.rapporten.filter(({ student }) => student._id === user._id).map((student) => student.student);
		if (students.length === 0) return;

		const student = students[0];

		toast.warn(
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

		updateOpdrachten();
	};

	const addExtraTijdEvent = (data) => {
		const { opdrachtId: opdrachtID } = data;
		if (opdrachtID !== opdrachtId) return;

		updateOpdrachten();
	};

	const wijzigStatusEvent = (data) => {
		const { opdrachtId: opdrachtID } = data;
		if (opdrachtID !== opdrachtId) return;

		updateOpdrachten();
	};

	const updateOpdrachten = async () => {
		const result = await Fetch(`/rapporten/${opdrachtId}`, 'GET');
		setResponse(result);
	};

	useEffect(() => {
		if (!response) return;
		if (response.opdracht.startDatum) setIsOpdrachtGestart(true);
		if (response.opdracht.seconden === 0 && response.opdracht.startDatum != null) setIsTijdAfgelopen(true);
		if (response.opdracht.gestoptDoorHost) setIsOpdrachtGestopt(true);
		if (response.opdracht.seconden) setTimerTijd(response.opdracht.seconden);
		if (response.opdracht.kanStudentExtraTijdVragen) setExtraTijdToegestaan(true);
		getGemiddeldeExtraTijd(opdrachtId);
	}, [response, opdrachtId]);

	useEffect(() => {
		if (!response) return;
		socket.on('vraagHulp', vraagHulpEvent);
		socket.on('addVraag', addVraagEvent);
		socket.on('startRapport', updateOpdrachten);
		socket.on('wijzigExtraTijd', addExtraTijdEvent);
		socket.on('wijzigStatus', wijzigStatusEvent);
		return () => socket.off();
	}, [response]);

	if (error) return <h1>Er is iets fout gegaan</h1>;
	if (loading) return <h1>Loading...</h1>;

	if (response.error) return alert(response.message);
	const { rapporten, opdracht } = response;

	const titel = opdracht.beschrijving;

	let actieButton;
	if (!isOpdrachtGestart && !isTijdAfgelopen) {
		actieButton = (
			<Button
				text='Start'
				className='m-0 text-2xl'
				click={startOpdracht}
				referace={actieButtonRef}
			/>
		);
	} else {
		if (!isOpdrachtBeeindigd || isTijdAfgelopen) {
			actieButton = (
				<Button
					text='Beëindig'
					className='m-0 text-2xl'
					click={stopOpdracht}
					referace={actieButtonRef}
				/>
			);
		}
	}

	let countDownTimer;
	if (isOpdrachtGestart && !isOpdrachtBeeindigd && timerTijd) {
		countDownTimer = (
			<div className='text-2xl pb-1 pl-2 pr-2 pt-1 flex items-center text-white bg-cyan-500 font-bold underline rounded-md'>
				<CountdownTimer
					seconden={timerTijd}
					onEnd={() => {
						setTimerTijd(null);
						setIsTijdAfgelopen(true);
					}}
				/>
			</div>
		);
	} else if (isOpdrachtBeeindigd) {
		countDownTimer = <div className='text-2xl pb-1 pl-2 pr-2 mr-2 pt-1 flex items-center text-white bg-cyan-500 font-bold underline rounded-md'>Opdracht is beeindigd</div>;
	} else if (isTijdAfgelopen || !timerTijd) {
		countDownTimer = <div className='text-2xl pb-1 pl-2 pr-2 mr-2 pt-1 flex items-center text-white bg-cyan-500 font-bold underline rounded-md'>Tijd is afgelopen</div>;
	}

	let extraTijdButton;
	if (extraTijdToegestaan) {
		extraTijdButton = <FaLockOpen />;
	} else {
		extraTijdButton = <FaLock />;
	}

	return (
		<main className={style.main}>
			<Header
				title='Host Dashboard'
				name='host stan'
			/>
			<div className='flex justify-center items-center flex-col'>
				<div className='flex w-80 justify-between'>
					<div className='w-full flex justify-center'>{countDownTimer}</div>
					<div className='w-full flex justify-center'>{actieButton}</div>
				</div>
				{isOpdrachtGestart && !isOpdrachtBeeindigd && (
					<div className='flex w-80 mt-5 justify-between'>
						<div className='w-full flex justify-center'>
							<div
								className={'text-2xl flex justify-center pb-2 pl-2 w-20 pr-2 pt-2 text-white font-bold cursor-pointer rounded-md ' + (extraTijdToegestaan ? 'bg-green-500' : 'bg-red-500')}
								onClick={wijzigKanStudentExtraTijdVragen}>
								{extraTijdButton}
							</div>
						</div>
						<div className='w-full flex justify-center'>
							<div className='text-2xl pb-1 pl-2 pr-2 pt-1 flex items-center text-white bg-orange-500 font-bold rounded-md '>
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
								closeAction={updateOpdrachten}
								studentNaam={rapport.student.voorNaam + ' ' + rapport.student.familieNaam}
								status={rapport.status}
								extraTijd={rapport.extraTijd}
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
			<ToastContainer />
		</main>
	);
};

export default OpdrachtElement;
