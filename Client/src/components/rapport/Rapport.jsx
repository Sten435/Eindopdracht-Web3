import React from 'react';
import style from './rapport.module.css';

const Rapport = (rapport) => {
	const { studentNaam, status, extraTijd, vragen } = rapport;

	const randomSeed = (Math.random() + 1).toString(36).substring(7);
	const randomRotation = Math.floor(Math.random() * (360 - 320 + 1)) + 0;
	return (
		<>
			<div className={style.rapportContainer}>
				<div>
					<div className="">
						<h2 className="">Status:</h2>
						<span className="">{status}</span>
					</div>
					<div className={style.extraTijdContainer}>
						<h2>Extra tijd:</h2>
						<span className={style.extraTijd}>+ {extraTijd} minuten</span>
					</div>
					<h2>Vragen:</h2>
					<ul>
						{vragen.map((vraag, index) => {
							return <li key={index}>{vraag}</li>;
						})}
					</ul>
				</div>
				<div className={style.infoContainer}>
					<h1 style={{ marginBottom: '1.2rem' }}>{studentNaam}</h1>
					<img className={style.img} src={`https://avatars.dicebear.com/api/miniavs/${randomSeed}.svg?&scale=88&rotate=${randomRotation}&translateX=3`} alt="face" />
				</div>
			</div>
		</>
	);
};

export default Rapport;
