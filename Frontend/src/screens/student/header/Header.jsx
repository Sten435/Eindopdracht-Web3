import React from 'react';
import './header.css';

const Header = () => {
	const studentNaam = '<Stan Persoons>';
	return (
		<header>
			<h1>Student Dashboard</h1>
			<b>{studentNaam}</b>
		</header>
	);
};

export default Header;
