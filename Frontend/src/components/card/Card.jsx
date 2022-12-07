import React from 'react';
import { Link } from 'react-router-dom';
import style from './card.module.css';

const Card = ({ opdracht: { titel, beschrijving, status }, to }) => {
	return (
		<Link
			to={to}
			style={{ textDecoration: 'none', width: '100%' }}>
			<div className={style.card}>
				<b>
					<h2>{titel}</h2>
					<p>{beschrijving}</p>
				</b>
				<span className={style.statusContainer + ' ' + style[status]}>{status.toLocaleUpperCase()}</span>
			</div>
		</Link>
	);
};

export default Card;
