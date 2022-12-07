import { Link } from 'react-router-dom';

const GaTerug = ({ text, to, style = {}, children }) => {
	if (children) {
		return (
			<div
				className='terugContainer'
				style={style}>
				<Link
					to={to}
					className='gaTerug'>
					{children}
				</Link>
			</div>
		);
	}
	return (
		<div
			className='terugContainer'
			style={style}>
			<Link
				to={to}
				className='gaTerug'>
				<b>{text}</b>
			</Link>
		</div>
	);
};

export default GaTerug;
