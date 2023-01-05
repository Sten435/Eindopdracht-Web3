import { Link } from 'react-router-dom';

const GaTerug = ({ text, to = null, textKleur = 'white', backgroundKleur = 'bg-red-500', children = null }) => {
	return (
		<div className={`p-[6px] rounded ${backgroundKleur}`}>
			<Link
				style={{ color: textKleur }}
				to={to ?? -1}>
				{children ?? <b>{text}</b>}
			</Link>
		</div>
	);
};

export default GaTerug;
