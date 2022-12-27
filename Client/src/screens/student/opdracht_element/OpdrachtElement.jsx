import { useParams } from 'react-router-dom';
import { BulletLijst, Button, GaTerug, Header, InputText, Section } from '../../../components/index.js';
import style from './opdrachtElement.module.css';

const OpdrachtElement = () => {
	const { id: opdrachtId } = useParams();

	const opdracht = {};
	const vragen = ['Ik heb een vraag voor de docent', 'Ik heb een vraag voor de medestudenten'];

	const { id, titel, beschrijving, status } = opdracht;
	return (
		<main className={style.main}>
			<Header title="Student Dashboard" name="student stan" />
			<Section noLine>
				<div className={style.helpContainer}>
					<h1 style={{ display: 'inline-block', marginBottom: '1.2rem' }}>
						{titel ?? '<Titel> - '} <b>1u 16m 12s</b>
					</h1>
					<Button text="Vraag Hulp 🤘" />
				</div>
			</Section>
			<Section title="Status">
				<div className={style.flexContainer}>
					<input name="status" type="radio" id="bezig" />
					<label htmlFor="bezig">
						<b>Bezig</b>
					</label>
				</div>
				<div className={style.flexContainer}>
					<input className={style.radio} name="status" type="radio" id="ikDoeNietMee" />
					<label htmlFor="ikDoeNietMee">
						<b>Ik doe niet mee</b>
					</label>
				</div>
				<div className={style.flexContainer}>
					<input className={style.radio} name="status" type="radio" id="ikGeefop" />
					<label htmlFor="ikGeefop">
						<b>Ik geef op</b>
					</label>
				</div>
				<div className={style.flexContainer}>
					<input className={style.radio} name="status" type="radio" id="ikBenKlaar" />
					<label htmlFor="ikBenKlaar">
						<b>Ik ben klaar</b>
					</label>
				</div>
				<Button text="Wijzig status" style={{ marginBottom: '2rem' }} />
			</Section>
			<Section title="Extra tijd">
				<div className={style.flexContainer} style={{ marginBottom: '2rem' }}>
					<Button text="+ 1 min" style={{ borderRadius: '8px 0 0 8px', borderRightWidth: '.01px' }} />
					<Button text="+ 5 min" style={{ borderRadius: 0, borderLeftWidth: '.01px' }} />
					<Button text="+ 10 min" style={{ borderRadius: '0 8px 8px 0', borderLeftWidth: '.01px' }} />
				</div>
			</Section>
			<Section title="Vragen">
				<BulletLijst items={vragen} />
				<InputText maxLength={255} />
				<Button text="Verstuur vraag" />
			</Section>
		</main>
	);
};

export default OpdrachtElement;
