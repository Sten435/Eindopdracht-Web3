import React from 'react';
import style from './cardGrid.module.css';

const CardGrid = ({ children }) => {
	return <section className={style.cardGridContainer}>{children}</section>;
};

export default CardGrid;
