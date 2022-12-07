import { useParams } from 'react-router-dom';
import { BulletLijst, Button, GaTerug, Header, InputText, Section } from '../../../components/index.js';
import style from './opdracht.module.css';

const Opdracht = () => {
	const { id: opdrachtId } = useParams();

	const opdracht = {};
	const vragen = ['Ik heb een vraag voor de docent', 'Ik heb een vraag voor de medestudenten'];

	const { id, titel, beschrijving, status } = opdracht;
	return (
		<main className={style.main}>
			<Header />
			<Section noLine>
				<GaTerug
					text='Ga Terug'
					to='/student/dashboard'
				/>
				<h1 style={{ marginBottom: '1.2rem' }}>{titel ?? '<Titel>'}</h1>
			</Section>
			<Section title='Status'>
				<div className={style.flexContainer}>
					<input
						name='status'
						type='radio'
						id='bezig'
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
						id='ikDoeNietMee'
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
						id='ikGeefop'
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
						id='ikBenKlaar'
					/>
					<label htmlFor='ikBenKlaar'>
						<b>Ik ben klaar</b>
					</label>
				</div>
				<Button
					text='Wijzig status'
					style={{ marginBottom: '2rem' }}
				/>
			</Section>
			<Section title='Extra tijd'>
				<div
					className={style.flexContainer}
					style={{ marginBottom: '2rem' }}>
					<Button
						text='+ 1 min'
						style={{ borderRadius: '8px 0 0 8px', borderRightWidth: '.01px' }}
					/>
					<Button
						text='+ 5 min'
						style={{ borderRadius: 0, borderLeftWidth: '.01px' }}
					/>
					<Button
						text='+ 10 min'
						style={{ borderRadius: '0 8px 8px 0', borderLeftWidth: '.01px' }}
					/>
				</div>
			</Section>
			<Section title='Vragen'>
				<BulletLijst items={vragen} />
				<InputText />
				<Button text='Verstuur vraag' />
			</Section>
		</main>
	);
};

export default Opdracht;
