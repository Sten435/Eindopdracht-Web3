import { Link } from 'react-router-dom';

const Button = ({ text, to = null, referace, disabled = false, className = {}, children, click }) => {
	return !to ? (
		<button onClick={click} className={className ?? ''} disabled={disabled} ref={referace}>
			{children ?? text}
		</button>
	) : (
		<Link to={to}>
			<button onClick={click} className={className ?? ''} disabled={disabled}>
				{children ?? text}
			</button>
		</Link>
	);
};

export default Button;
