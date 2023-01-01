import { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaClock, FaClosedCaptioning } from 'react-icons/fa';
import CountdownTimer from '../../../components/counter/CountdownTimer.jsx';
import { BulletLijst, Button, Header, InputText, Section } from '../../../components/index.js';
import Fetch from '../../../controller/fetch.js';
import LoadPage from '../../../controller/loadPage.js';
import style from './opdrachtElement.module.css';

const OpdrachtElement = () => {
	const [vragen, setVraag] = useState([]);
	const [selectedButton, setSelectedButton] = useState();
	const [selectedRadioButton, setSelectedRadioButton] = useState();
	const [bestaatRapport, setBestaatRapport] = useState(false);
	const [kanStudentExtraTijdVragen, setKanStudentExtraTijdVragen] = useState(true);

	const { id: opdrachtId } = useParams();
	const navigate = useNavigate();

	const vraagRef = useRef();
	const vragenFormRef = useRef();
	const statusFormRef = useRef();
	const bezigStatusRef = useRef();

	const result = LoadPage(`/opdrachten/${opdrachtId}`, 'GET');
	const { response, loading, error, user, socket } = result;

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

		if (rapport.extraMinuten === 1) {
			setSelectedButton({ een: true, vijf: false, tien: false });
		} else if (rapport.extraMinuten === 5) {
			setSelectedButton({ een: false, vijf: true, tien: false });
		} else if (rapport.extraMinuten === 10) {
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
		if (result.status !== 'Lopend') return navigate('/student/dashboard');

		getRapportInfo();
		getVragenVanRapport();
	};

	useEffect(() => {
		if (!user) return;
		getOpdrachtData();
		if (!response) return;
		setKanStudentExtraTijdVragen(response.opdracht.kanStudentExtraTijdVragen);
	}, [user, response]);

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading || selectedRadioButton === undefined) return <p>Loading...</p>;

	const { naam, beschrijving, seconden: timeLeft, kanStudentExtraTijdVragen: extraTijdVragen } = response.opdracht;

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
	};

	const wijzigStatus = async (e) => {
		e.preventDefault();
		const status = statusFormRef.current.status.value;

		if (selectedRadioButton === status || !status) return;

		setSelectedRadioButton(status.toLowerCase());

		const result = await Fetch('/rapporten/status', 'PUT', { studentId: user._id, opdrachtId, status });
		if (result.error) return alert(result.message);
	};

	const wijzigMinuten = async (buttons) => {
		if (JSON.stringify(selectedButton) === JSON.stringify(buttons) || !buttons) return;
		setSelectedButton(buttons);
		const button = Object.keys(buttons).find((b) => buttons[b]);

		const minutenObject = { een: 1, vijf: 5, tien: 10 };
		const result = await Fetch('/rapporten/tijd', 'PUT', { studentId: user._id, opdrachtId, extraTijd: minutenObject[button] });
		if (result.error) return alert(result.message);
	};

	const vraagHulp = async () => {
		if (!socket) return console.log('socket is undefined');
		socket.emit('toClient', { opdrachtId, userId: user._id, action: 'vraagHulp' });
	};

	return (
		<main className={style.main}>
			<Header
				title='Student Dashboard'
				name='student stan'
			/>
			<Section noLine>
				<div className={style.helpContainer}>
					{timeLeft !== 0 && (
						<span className='text-2xl pb-1 pl-2 pr-2 pt-1 mb-4 mr-2 flex items-center text-white bg-cyan-500 font-bold underline rounded-md'>
							<FaClock
								className='mr-5'
								size={25}
							/>
							<CountdownTimer
								seconden={timeLeft}
								onEnd={() => navigate('/student/dashboard?=reden=opdracht afgelopen')}
							/>
						</span>
					)}
					<h1 className='text-2xl underline font-bold mb-2'>{naam}</h1>
					<p className='m-4'>{beschrijving}</p>
					<div className='flex'>
						{!bestaatRapport && (
							<Button
								text='Start Opdracht'
								className='mt-8 mr-5 text-2xl'
								click={startReport}
							/>
						)}
						{bestaatRapport && (
							<Button
								className='mt-8 ml-5 text-2xl'
								text='Vraag Hulp 🤘'
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
									click={() => wijzigMinuten({ een: true, vijf: false, tien: false })}
								/>
								<Button
									text='+ 5 min'
									className={'mt-5 ml-1 mr-1 ' + (selectedButton?.vijf === true ? 'bg-green-600 text-white' : '')}
									disabled={selectedButton?.vijf}
									click={() => wijzigMinuten({ een: false, vijf: true, tien: false })}
								/>
								<Button
									text='+ 10 min'
									className={'mt-5 ml-2 ' + (selectedButton?.tien === true ? 'bg-green-600 text-white' : '')}
									disabled={selectedButton?.tien}
									click={() => wijzigMinuten({ een: false, vijf: false, tien: true })}
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
