import React from 'react';
import { Link } from 'react-router-dom';
import style from './card.module.css';

const Card = ({ opdracht: { titel, beschrijving, status }, to }) => {
	return (
		<Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
			<div className={style.card}>
				<div>
					<h2>{titel}</h2>
					<p style={{ marginBottom: '20px' }}>{beschrijving}</p>
					<span>
						Resterend: <b className={style.resterendeTijd}>1u 16m 12s</b>
					</span>
				</div>
				{status && <span className={style.statusContainer + ' ' + style[status]}>{status}</span>}
			</div>
		</Link>
	);
};

export default Card;
