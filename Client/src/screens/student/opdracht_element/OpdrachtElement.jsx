import { useEffect, useRef, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import BulletLijst from '../../../components/bulletLijst/BulletLijst.jsx';
import Button from '../../../components/button/Button.jsx';
import CountdownTimer from '../../../components/counter/CountdownTimer.jsx';
import Header from '../../../components/header/Header.jsx';
import InputText from '../../../components/inputText/InputText.jsx';
import Section from '../../../components/section/Section.jsx';
import Fetch from '../../../controller/fetch.js';
import LoadPage from '../../../controller/loadPage.js';
import { socket } from '../../../controller/socket.js';
import style from './opdrachtElement.module.css';

const OpdrachtElement = () => {
	const [vragen, setVraag] = useState([]);
	const [selectedButton, setSelectedButton] = useState();
	const [selectedRadioButton, setSelectedRadioButton] = useState();
	const [bestaatRapport, setBestaatRapport] = useState(false);
	const [tijd, setTijd] = useState();
	const [kanStudentExtraTijdVragen, setKanStudentExtraTijdVragen] = useState(true);

	const { id: opdrachtId } = useParams();
	const navigate = useNavigate();

	const vraagRef = useRef();
	const vragenFormRef = useRef();
	const statusFormRef = useRef();
	const bezigStatusRef = useRef();

	const { response, updateScreen, loading, error, user } = LoadPage(`/opdrachten/${opdrachtId}`, 'GET');

	const getRapportInfo = async () => {
		const result = await Fetch(`/rapporten/${user._id}/${opdrachtId}`, 'GET');

		const { rapport } = result;

		if (!rapport && result.message.toLowerCase() === 'rapport bestaat niet') {
			setSelectedButton(null);
			setSelectedRadioButton(null);
			setBestaatRapport(false);
			return;
		}

		if (result.error) return alert(result.message);

		setBestaatRapport(true);
		setSelectedRadioButton(rapport.status);

		if (rapport.extraTijd === 1) {
			setSelectedButton({ een: true, vijf: false, tien: false });
		} else if (rapport.extraTijd === 5) {
			setSelectedButton({ een: false, vijf: true, tien: false });
		} else if (rapport.extraTijd === 10) {
			setSelectedButton({ een: false, vijf: false, tien: true });
		}
	};

	const getVragenVanRapport = async () => {
		const result = await Fetch(`/rapporten/vraag/${user._id}/${opdrachtId}`, 'GET');
		if (result.error) return alert(result.message);
		setVraag(result.vragen);
	};

	const getOpdrachtData = async () => {
		const result = await Fetch('/opdrachten/status', 'POST', { opdrachtId });
		if (result.error) return alert(result.message);
		if (result.status !== 'Lopend') return navigate('/student/dashboard', { replace: true, reden: `rapport is niet beschikbaar (status: ${result.status})` });

		getRapportInfo();
		getVragenVanRapport();
	};

	const addVraag = async () => {
		const nieuweVraag = vraagRef.current.value;
		if (!nieuweVraag) return;

		if (vragen.includes(nieuweVraag)) {
			vragenFormRef.current.reset();
			vraagRef.current.placeholder = 'Je hebt deze vraag al eens gesteld';
			await new Promise((resolve) => setTimeout(resolve, 1250));
		} else {
			const result = await Fetch('/rapporten/vraag', 'POST', { studentId: user._id, opdrachtId, vraag: nieuweVraag });
			if (result.error) return alert(result.message);
			setVraag([...vragen, nieuweVraag]);
			socket.emit('toClient', { opdrachtId, action: 'addVraag' });
		}

		vragenFormRef.current.reset();
		vraagRef.current.placeholder = 'Stel je vraag hier';
	};

	const startReport = async () => {
		const result = await Fetch('/rapporten/start', 'POST', { studentId: user._id, opdrachtId });
		if (result.error) return alert(result.message);

		setSelectedRadioButton('bezig');
		setBestaatRapport(true);
		if (bezigStatusRef.current) bezigStatusRef.current.checked = true;
		socket.emit('toClient', { opdrachtId, action: 'startRapport' });
	};

	const wijzigStatus = async (e) => {
		e.preventDefault();
		const status = statusFormRef.current.status.value;

		if (selectedRadioButton === status || !status) return;

		setSelectedRadioButton(status.toLowerCase());

		const result = await Fetch('/rapporten/status', 'PUT', { studentId: user._id, opdrachtId, status });
		if (result.error) return alert(result.message);

		socket.emit('toClient', { opdrachtId, action: 'wijzigStatus' });
	};

	const wijzigExtraTijd = async (buttons) => {
		if (JSON.stringify(selectedButton) === JSON.stringify(buttons) || !buttons) return;
		setSelectedButton(buttons);
		const button = Object.keys(buttons).find((b) => buttons[b]);

		const minutenObject = { een: 1, vijf: 5, tien: 10 };
		const result = await Fetch('/rapporten/tijd', 'PUT', { studentId: user._id, opdrachtId, extraTijd: minutenObject[button] });
		if (result.error) return alert(result.message);

		socket.emit('toClient', { opdrachtId, action: 'wijzigExtraTijd' });
	};

	const vraagHulp = async () => {
		socket.emit('toClient', { opdrachtId, userId: user._id, action: 'vraagHulp' });
	};

	const voegExtraTijdToeEvent = (data) => {
		const { opdrachtId: opdrachtID } = data;
		if (opdrachtID !== opdrachtId) return;

		setTijd(data.nieuweTijd);
	};

	const wijzigKanStudentExtraTijdVragenEvent = (data) => {
		const { opdrachtId: opdrachtID } = data;
		if (opdrachtID !== opdrachtId) return;

		const { extraTijdToegestaan } = data;
		setKanStudentExtraTijdVragen(extraTijdToegestaan);
	};

	const removeRapportEvent = (data) => {
		const { opdrachtId: opdrachtID, userId } = data;

		if (opdrachtID !== opdrachtId) return;
		if (userId !== user._id) return;

		alert('Rapport is verwijderd door host');
		navigate('/student/dashboard');
	};

	const removeOpdrachtEvent = (data) => {
		const { opdrachtId: opdrachtID } = data;

		if (opdrachtID !== opdrachtId) return;

		alert('Opdracht is verwijderd door host');
		navigate('/student/dashboard');
	};

	useEffect(() => {
		if (!user) return;
		getOpdrachtData();

		if (!response) return;
		setKanStudentExtraTijdVragen(response.opdracht.kanStudentExtraTijdVragen);

		if (!tijd) setTijd(response.opdracht.seconden);
	}, [user, response]);

	useEffect(() => {
		socket.on('voegExtraTijdToe', voegExtraTijdToeEvent);
		socket.on('wijzigKanStudentExtraTijdVragen', wijzigKanStudentExtraTijdVragenEvent);
		socket.on('removeRapport', removeRapportEvent);
		socket.on('removeOpdracht', removeOpdrachtEvent);
		socket.on('refreshData', updateScreen);

		return () => socket.off();
	}, [response]);

	if (error) {
		alert(error.message);
		navigate('/student/dashboard');
	}

	if (loading || selectedRadioButton === undefined) return <p>Loading...</p>;

	const { naam, beschrijving } = response.opdracht;

	return (
		<main className={style.main}>
			<Header
				title='Student'
				metTerugButton
				name={user.voorNaam + ' ' + user.familieNaam}
			/>
			<Section noLine>
				<div className='flex flex-col items-center mt-10'>
					{tijd && tijd !== 0 && (
						<span className='text-4xl p-2 mb-4 pr-4 flex items-center text-white bg-gray-700 font-bold rounded-md'>
							<FaClock
								className='mr-5 ml-2'
								size={30}
							/>
							<CountdownTimer
								seconden={tijd}
								onEnd={() => navigate('/student/dashboard', { replace: true, state: { reden: 'Opdracht is afgelopen' } })}
							/>
						</span>
					)}
					<h1 className='mt-5 mb-2 text-center text-gray-700 font-bold text-2xl'>{naam}</h1>
					<p className='m-4 text-center'>{beschrijving}</p>
					<div className='flex'>
						{!bestaatRapport && (
							<Button
								text='Start Opdracht'
								className='mt-5 text-2xl'
								click={startReport}
							/>
						)}
						{bestaatRapport && (
							<Button
								className='mt-5 text-2xl'
								text='Vraag Hulp 👋'
								click={vraagHulp}
							/>
						)}
					</div>
				</div>
			</Section>
			{bestaatRapport && (
				<>
					<Section title='Status'>
						<form
							onSubmit={(e) => wijzigStatus(e)}
							ref={statusFormRef}>
							<div className='mt-4'>
								<input
									name='status'
									value='bezig'
									type='radio'
									id='bezig'
									ref={bezigStatusRef}
									defaultChecked={selectedRadioButton === 'bezig'}
								/>
								<label htmlFor='bezig'>
									<b>Bezig</b>
								</label>
							</div>
							<div className={style.flexContainer}>
								<input
									className={style.radio}
									name='status'
									type='radio'
									value='ik doe niet mee'
									id='ikDoeNietMee'
									defaultChecked={selectedRadioButton === 'ik doe niet mee'}
								/>
								<label htmlFor='ikDoeNietMee'>
									<b>Ik doe niet mee</b>
								</label>
							</div>
							<div className={style.flexContainer}>
								<input
									className={style.radio}
									name='status'
									type='radio'
									value='ik geef op'
									id='ikGeefop'
									defaultChecked={selectedRadioButton === 'ik geef op'}
								/>
								<label htmlFor='ikGeefop'>
									<b>Ik geef op</b>
								</label>
							</div>
							<div className={style.flexContainer}>
								<input
									className={style.radio}
									name='status'
									type='radio'
									value='ik ben klaar'
									id='ikBenKlaar'
									defaultChecked={selectedRadioButton === 'ik ben klaar'}
								/>
								<label htmlFor='ikBenKlaar'>
									<b>Ik ben klaar</b>
								</label>
							</div>
							<Button text='Wijzig status' />
						</form>
					</Section>
					{kanStudentExtraTijdVragen && (
						<Section title='Extra tijd'>
							<div
								className={style.flexContainer}
								style={{ marginBottom: '2rem' }}>
								<Button
									text='+ 1 min'
									className={'mt-5 mr-2 ' + (selectedButton?.een === true ? 'bg-green-600 text-white' : '')}
									disabled={selectedButton?.een}
									click={() => wijzigExtraTijd({ een: true, vijf: false, tien: false })}
								/>
								<Button
									text='+ 5 min'
									className={'mt-5 ml-1 mr-1 ' + (selectedButton?.vijf === true ? 'bg-green-600 text-white' : '')}
									disabled={selectedButton?.vijf}
									click={() => wijzigExtraTijd({ een: false, vijf: true, tien: false })}
								/>
								<Button
									text='+ 10 min'
									className={'mt-5 ml-2 ' + (selectedButton?.tien === true ? 'bg-green-600 text-white' : '')}
									disabled={selectedButton?.tien}
									click={() => wijzigExtraTijd({ een: false, vijf: false, tien: true })}
								/>
							</div>
						</Section>
					)}
					<Section title='Vragen'>
						<form
							ref={vragenFormRef}
							onSubmit={(e) => e.preventDefault()}>
							<InputText
								maxLength={255}
								referace={vraagRef}
								placeholder={vraagRef.current?.placeholder ?? 'Stel je vraag hier'}
								value={vraagRef.current?.value}
								className='mt-4'
							/>
							<Button
								text='Verstuur vraag'
								click={addVraag}
							/>
							<BulletLijst items={vragen} />
						</form>
					</Section>
				</>
			)}
		</main>
	);
};

export default OpdrachtElement;
