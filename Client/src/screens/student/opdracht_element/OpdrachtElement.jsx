import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BulletLijst, Button, Header, InputText, Section } from '../../../components/index.js';
import Fetch from '../../../controller/fetch.js';
import LoadPage from '../../../controller/loadPage.js';
import style from './opdrachtElement.module.css';

const OpdrachtElement = () => {
	const [vragen, setVraag] = useState([]);
	const [eenMinuutButton, setEenMinuutButton] = useState(false);
	const [vijfMinuutButton, setVijfMinuutButton] = useState(false);
	const [tienMinuutButton, setTienMinuutButton] = useState(false);
	const { id: opdrachtId } = useParams();
	const vraagRef = useRef();
	const vragenFormRef = useRef();
	const statusFormRef = useRef();

	const result = LoadPage(`/opdrachten/${opdrachtId}`, 'GET');
	const { response, loading, error, user } = result;

	useEffect(() => {
		if (!user) return;

		Fetch(`/opdrachten/vraag/${user._id}/${opdrachtId}`, 'GET').then((vragen) => {
			setVraag(vragen);
		});
	}, [user, opdrachtId]);

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading) return <p>Loading...</p>;

	const { naam, beschrijving, minuten } = response;

	const addVraag = async () => {
		const nieuweVraag = vraagRef.current.value;
		if (!nieuweVraag) return;

		if (vragen.includes(nieuweVraag)) {
			vragenFormRef.current.reset();
			vraagRef.current.placeholder = 'Je hebt deze vraag al eens gesteld';
			await new Promise((resolve) => setTimeout(resolve, 1250));
		} else {
			const result = await Fetch('/opdrachten/vraag', 'POST', { studentId: user._id, opdrachtId, vraag: nieuweVraag });
			if (!result.error) setVraag([...vragen, nieuweVraag]);
			else alert(result.message);
		}

		vragenFormRef.current.reset();
		vraagRef.current.placeholder = 'Stel je vraag hier';
	};

	const startReport = async () => {
		const result = await Fetch('/rapporten/start', 'POST', { studentId: user._id, opdrachtId });

		if (!result.error) console.log(result);
		else alert(result.message);
	};

	const wijzigStatus = async (e) => {
		e.preventDefault();
		const status = statusFormRef.current.status.value;

		const result = await Fetch('/rapporten/status', 'PUT', { studentId: user._id, opdrachtId, status });

		if (!result.error) console.log(result);
		else alert(result.message);
	};

	return (
		<main className={style.main}>
			<Header title="Student Dashboard" name="student stan" />
			<Section noLine>
				<div className={style.helpContainer}>
					<h1 className="text-2xl underline font-bold mb-2">{naam}</h1>
					<p className="m-4">{beschrijving}</p>
					<b className="text-xl font-bold">{minuten} min</b>
					<Button text="Vraag Hulp 🤘" />
					<hr className="w-full" />
					<Button text="Start" className="mt-8 text-2xl" click={startReport} />
				</div>
			</Section>
			<Section title="Status">
				<form onSubmit={(e) => wijzigStatus(e)} ref={statusFormRef}>
					<div className="mt-4">
						<input name="status" value="bezig" type="radio" id="bezig" />
						<label htmlFor="bezig">
							<b>Bezig</b>
						</label>
					</div>
					<div className={style.flexContainer}>
						<input className={style.radio} name="status" type="radio" value="ik doe niet mee" id="ikDoeNietMee" />
						<label htmlFor="ikDoeNietMee">
							<b>Ik doe niet mee</b>
						</label>
					</div>
					<div className={style.flexContainer}>
						<input className={style.radio} name="status" type="radio" value="ik geef op" id="ikGeefop" />
						<label htmlFor="ikGeefop">
							<b>Ik geef op</b>
						</label>
					</div>
					<div className={style.flexContainer}>
						<input className={style.radio} name="status" type="radio" value="ik ben klaar" id="ikBenKlaar" />
						<label htmlFor="ikBenKlaar">
							<b>Ik ben klaar</b>
						</label>
					</div>
					<Button text="Wijzig status" style={{ marginBottom: '2rem' }} />
				</form>
			</Section>
			<Section title="Extra tijd">
				<div className={style.flexContainer} style={{ marginBottom: '2rem' }}>
					<Button text="+ 1 min" className={'mt-5 mr-2' + (eenMinuutButton && ' bg-green-600 text-white') ?? ''} click={() => {
						setEenMinuutButton(true);
						setVijfMinuutButton(false);
						setTienMinuutButton(false);
					}} />
					<Button text="+ 5 min" className={'mt-5 ml-1 mr-1' + (vijfMinuutButton && ' bg-green-600 text-white') ?? ''} click={() => {
						setEenMinuutButton(false);
						setVijfMinuutButton(true)
						setTienMinuutButton(false);

					}} />
					<Button text="+ 10 min" className={'mt-5 mr-2' + (tienMinuutButton && ' bg-green-600 text-white') ?? ''} click={() => {
						setEenMinuutButton(false);
						setVijfMinuutButton(false);
						setTienMinuutButton(true)
					}} />
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
