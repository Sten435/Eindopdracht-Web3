import React from 'react';
import GaTerug from '../gaTerug/GaTerug';

const Header = ({ title, name, metTerugButton = true, metLogoutButton = true }) => {
	return (
		<header className="header p-3 mb-8 sticky top-0">
			{metTerugButton && <GaTerug backgroundKleur="#1d7cb6" text="Ga Terug" />}
			<h1 className="text-3xl font-bold">{title}</h1>
			<b className="text-3xl font-bold">{name}</b>
			{metLogoutButton && <GaTerug text="Logout" to="/logout" />}
		</header>
	);
};

export default Header;
