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
		countDownTimer = 'Niet Begonnen';
		boxColor = 'bg-gray-500 opacity-60';
	}

	return (
		<Link
			to={to}
			className='decoration-transparent w-full'>
			<div className={style.card}>
				<div>
					<h2 className='m-0'>{naam}</h2>
					<p className='mb-5'>{beschrijving}</p>
					<span>
						{!isLopend && startDatum && <p className='mr-2 inline'>Resterend:</p>}
						<b className={`text-white p-1 px-2 ml-0 rounded ${boxColor}`}>{countDownTimer}</b>
					</span>
				</div>
				{status && <span className={'p-[5px] text-center text-white font-bold rounded ' + style[status]}>{status}</span>}
			</div>
		</Link>
	);
};

export default Card;
