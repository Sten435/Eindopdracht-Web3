import { Link } from 'react-router-dom';

const GaTerug = ({ text, to = null, textKleur = 'white', backgroundKleur = 'rgba(221, 7, 7, 0.771)', children = null }) => {
	return (
		<div style={{ backgroundColor: backgroundKleur, padding: '6px', borderRadius: '4px' }}>
			<Link
				style={{ color: textKleur }}
				to={to ?? -1}>
				{children ?? <b>{text}</b>}
			</Link>
		</div>
	);
};

export default GaTerug;
