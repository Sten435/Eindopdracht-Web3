import React from 'react';

const Header = ({ title, name }) => {
	return (
		<header className="header p-3 mb-8">
			<h1 className="text-3xl font-bold">{title}</h1>
			<b className="text-3xl font-bold">{name}</b>
		</header>
	);
};

export default Header;
