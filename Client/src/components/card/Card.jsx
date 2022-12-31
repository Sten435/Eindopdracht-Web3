import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../counter/CountdownTimer';
import style from './card.module.css';

const Card = (result) => {
	const {
		opdracht: { naam, beschrijving, seconden, status, startDatum, gestoptDoorHost },
		to,
	} = result;

	const [isLopend, setIsLopend] = useState(startDatum && !gestoptDoorHost && !seconden);
	const isBeeindigd = gestoptDoorHost;

	let countDownTimer;
	if (isLopend) {
		countDownTimer = 'Tijd is afgelopen';
	} else if (startDatum && !gestoptDoorHost) {
		countDownTimer = (
			<CountdownTimer
				seconden={seconden}
				onEnd={() => setIsLopend(true)}
			/>
		);
	} else if (isBeeindigd) {
		countDownTimer = 'Beeindigd';
	} else {
		countDownTimer = 'Niet begonnen';
	}

	return (
		<Link
			to={to}
			style={{ textDecoration: 'none', width: '100%' }}>
			<div className={style.card}>
				<div>
					<h2>{naam}</h2>
					<p style={{ marginBottom: '20px' }}>{beschrijving}</p>
					<span>
						{!isLopend && !isBeeindigd && startDatum && !gestoptDoorHost && 'Resterend:'}
						<b className='bg-cyan-500 text-white p-1 ml-2 rounded-md'>{countDownTimer}</b>
					</span>
				</div>
				{status && <span className={style.statusContainer + ' ' + style[status]}>{status}</span>}
			</div>
		</Link>
	);
};

export default Card;
