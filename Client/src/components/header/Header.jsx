import React from 'react';

const Header = ({ title, name }) => {
	return (
		<header className='header'>
			<h1>{title}</h1>
			<b>{name}</b>
		</header>
	);
};

export default Header;
