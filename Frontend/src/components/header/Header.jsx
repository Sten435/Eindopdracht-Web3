import React from 'react';

const Header = () => {
	const studentNaam = '<Stan Persoons>';
	return (
		<header className='header'>
			<h1>Student Dashboard</h1>
			<b>{studentNaam}</b>
		</header>
	);
};

export default Header;
