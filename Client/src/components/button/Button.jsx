import { Link } from 'react-router-dom';

const Button = ({ text, to = null, className = {}, children, click }) => {
	return !to ? (
		<button onClick={click} className={className ?? ''}>
			{children ?? text}
		</button>
	) : (
		<Link to={to}>
			<button onClick={click} className={className ?? ''}>
				{children ?? text}
			</button>
		</Link>
	);
};

export default Button;
