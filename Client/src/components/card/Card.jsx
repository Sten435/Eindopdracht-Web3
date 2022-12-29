import React from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../counter/CountdownTimer';
import style from './card.module.css';

const Card = ({ opdracht: { naam, beschrijving, seconden, status }, to }) => {
	return (
		<Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
			<div className={style.card}>
				<div>
					<h2>{naam}</h2>
					<p style={{ marginBottom: '20px' }}>{beschrijving}</p>
					<span>
						Resterend:{' '}
						<b className={style.resterendeTijd}>
							<CountdownTimer seconden={seconden} />
						</b>
					</span>
				</div>
				{status && <span className={style.statusContainer + ' ' + style[status]}>{status}</span>}
			</div>
		</Link>
	);
};

export default Card;
