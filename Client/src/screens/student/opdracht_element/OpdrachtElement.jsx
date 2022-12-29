import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BulletLijst, Button, Header, InputText, Section } from '../../../components/index.js';
import Fetch from '../../../controller/fetch.js';
import LoadPage from '../../../controller/loadPage.js';
import style from './opdrachtElement.module.css';

const OpdrachtElement = () => {
	const [vragen, setVraag] = useState([]);
	const [selectedButton, setSelectedButton] = useState();
	const [selectedStatus, setSelectedStatus] = useState('NAN');

	const { id: opdrachtId } = useParams();

	const vraagRef = useRef();
	const vragenFormRef = useRef();
	const startStatusRef = useRef();
	const statusFormRef = useRef();
	const bezigStatusRef = useRef();

	const result = LoadPage(`/opdrachten/${opdrachtId}`, 'GET');
	const { response, loading, error, user } = result;

	useEffect(() => {
		if (!user) return;

		Fetch(`/rapporten/${user._id}/${opdrachtId}`, 'GET').then((result) => {
			const { rapport } = result;
			if (!rapport && result.message.toLowerCase() === 'rapport bestaat niet') {
				setSelectedButton({});
				setSelectedStatus('');
				if (startStatusRef.current) startStatusRef.current.classList.remove('hidden');
				return;
			}

			setSelectedStatus(rapport.status);

			if (rapport.extraMinuten === 1) {
				setSelectedButton({ een: true, vijf: false, tien: false });
			} else if (rapport.extraMinuten === 5) {
				setSelectedButton({ een: false, vijf: true, tien: false });
			} else if (rapport.extraMinuten === 10) {
				setSelectedButton({ een: false, vijf: false, tien: true });
			}
		});

		Fetch(`/opdrachten/vraag/${user._id}/${opdrachtId}`, 'GET').then((result) => {
			if (result.error) return alert(result.message);
			setVraag(result.vragen);
		});
	}, [user, opdrachtId]);

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading || selectedStatus === 'NAN') return <p>Loading...</p>;

	const { naam, beschrijving, seconden } = response;

	const addVraag = async () => {
		const nieuweVraag = vraagRef.current.value;
		if (!nieuweVraag) return;

		if (vragen.includes(nieuweVraag)) {
			vragenFormRef.current.reset();
			vraagRef.current.placeholder = 'Je hebt deze vraag al eens gesteld';
			await new Promise((resolve) => setTimeout(resolve, 1250));
		} else {
			Fetch('/opdrachten/vraag', 'POST', { studentId: user._id, opdrachtId, vraag: nieuweVraag }).then((result) => {
				if (result.error) return alert(result.message);
				setVraag([...vragen, nieuweVraag]);
			});
		}

		vragenFormRef.current.reset();
		vraagRef.current.placeholder = 'Stel je vraag hier';
	};

	const startReport = async () => {
		Fetch('/rapporten/start', 'POST', { studentId: user._id, opdrachtId }).then((result) => {
			if (result.error) return alert(result.message);

			setSelectedStatus('bezig');
			bezigStatusRef.current.checked = true;
			if (startStatusRef.current) startStatusRef.current.classList.add('hidden');
		});
	};

	const wijzigStatus = async (e) => {
		e.preventDefault();
		const status = statusFormRef.current.status.value;

		if (selectedStatus === status || !status) return;

		setSelectedStatus(status.toLowerCase());

		Fetch('/rapporten/status', 'PUT', { studentId: user._id, opdrachtId, status }).then((result) => {
			if (result.error) return alert(result.message);
		});
	};

	const wijzigMinuten = async (buttons) => {
		if (JSON.stringify(selectedButton) === JSON.stringify(buttons) || !buttons) return;
		setSelectedButton(buttons);
		const button = Object.keys(buttons).find((b) => buttons[b]);

		const minutenObject = { een: 1, vijf: 5, tien: 10 };
		Fetch('/rapporten/tijd', 'PUT', { studentId: user._id, opdrachtId, extraTijd: minutenObject[button] }).then((result) => {
			if (result.error) return alert(result.message);
		});
	};

	return (
		<main className={style.main}>
			<Header title="Student Dashboard" name="student stan" />
			<Section noLine>
				<div className={style.helpContainer}>
					<h1 className="text-2xl underline font-bold mb-2">{naam}</h1>
					<p className="m-4">{beschrijving}</p>
					<b className="text-xl font-bold">{seconden} min</b>
					<Button text="Vraag Hulp 🤘" />
					<hr className="w-full" />
					<Button text="Start" className="mt-8 text-2xl hidden" referace={startStatusRef} click={startReport} />
				</div>
			</Section>
			<Section title="Status">
				<form onSubmit={(e) => wijzigStatus(e)} ref={statusFormRef}>
					<div className="mt-4">
						<input name="status" value="bezig" type="radio" id="bezig" ref={bezigStatusRef} defaultChecked={selectedStatus === 'bezig'} />
						<label htmlFor="bezig">
							<b>Bezig</b>
						</label>
					</div>
					<div className={style.flexContainer}>
						<input className={style.radio} name="status" type="radio" value="ik doe niet mee" id="ikDoeNietMee" defaultChecked={selectedStatus === 'ik doe niet mee'} />
						<label htmlFor="ikDoeNietMee">
							<b>Ik doe niet mee</b>
						</label>
					</div>
					<div className={style.flexContainer}>
						<input className={style.radio} name="status" type="radio" value="ik geef op" id="ikGeefop" defaultChecked={selectedStatus === 'ik geef op'} />
						<label htmlFor="ikGeefop">
							<b>Ik geef op</b>
						</label>
					</div>
					<div className={style.flexContainer}>
						<input className={style.radio} name="status" type="radio" value="ik ben klaar" id="ikBenKlaar" defaultChecked={selectedStatus === 'ik ben klaar'} />
						<label htmlFor="ikBenKlaar">
							<b>Ik ben klaar</b>
						</label>
					</div>
					<Button text="Wijzig status" />
				</form>
			</Section>
			<Section title="Extra tijd">
				<div className={style.flexContainer} style={{ marginBottom: '2rem' }}>
					<Button text="+ 1 min" className={'mt-5 mr-2 ' + (selectedButton?.een === true ? 'bg-green-600 text-white' : '')} disabled={selectedButton?.een} click={() => wijzigMinuten({ een: true, vijf: false, tien: false })} />
					<Button text="+ 5 min" className={'mt-5 ml-1 mr-1 ' + (selectedButton?.vijf === true ? 'bg-green-600 text-white' : '')} disabled={selectedButton?.vijf} click={() => wijzigMinuten({ een: false, vijf: true, tien: false })} />
					<Button text="+ 10 min" className={'mt-5 ml-2 ' + (selectedButton?.tien === true ? 'bg-green-600 text-white' : '')} disabled={selectedButton?.tien} click={() => wijzigMinuten({ een: false, vijf: false, tien: true })} />
				</div>
			</Section>
			<Section title="Vragen">
				<form ref={vragenFormRef} onSubmit={(e) => e.preventDefault()}>
					<InputText maxLength={255} referace={vraagRef} placeholder={vraagRef.current?.placeholder ?? 'Stel je vraag hier'} value={vraagRef.current?.value} className="mt-4" />
					<Button text="Verstuur vraag" click={addVraag} />
					<BulletLijst items={vragen} />
				</form>
			</Section>
		</main>
	);
};

export default OpdrachtElement;
