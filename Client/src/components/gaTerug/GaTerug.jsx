import { Link } from 'react-router-dom';

const GaTerug = ({ text, to = null, textKleur = 'white', backgroundKleur = 'rgba(221, 7, 7, 0.771)', children }) => {
	if (children) {
		return (
			<div style={{ backgroundColor: backgroundKleur, padding: '10px', borderRadius: '10px' }}>
				<Link style={{ color: 'white' }} to={to ?? -1}>
					{children}
				</Link>
			</div>
		);
	}
	return (
		<div style={{ backgroundColor: backgroundKleur, padding: '10px', borderRadius: '10px' }}>
			<Link style={{ color: textKleur }} to={to ?? -1}>
				<b>{text}</b>
			</Link>
		</div>
	);
};

export default GaTerug;
