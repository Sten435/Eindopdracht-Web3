import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../counter/CountdownTimer';
import style from './card.module.css';

const Card = (result) => {
	const {
		opdracht: { naam, beschrijving, seconden, status, startDatum },
		to,
	} = result;

	const [isLopend, setIsLopend] = useState(startDatum && !seconden);

	let countDownTimer, boxColor;
	if (isLopend) {
		countDownTimer = 'Tijd Is Afgelopen';
		boxColor = 'bg-red-500';
	} else if (startDatum) {
		countDownTimer = (
			<CountdownTimer
				seconden={seconden}
				onEnd={() => setIsLopend(true)}
			/>
		);
		boxColor = 'bg-green-500';
	} else {
		countDownTimer = 'Niet Gestart';
		boxColor = 'bg-gray-500';
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
						{!isLopend && startDatum && <p className='mr-2 inline'>Resterend:</p>}
						<b className={`text-white p-1 px-2 ml-0 rounded ${boxColor}`}>{countDownTimer}</b>
					</span>
				</div>
				{status && <span className={style.statusContainer + ' ' + style[status]}>{status}</span>}
			</div>
		</Link>
	);
};

export default Card;
