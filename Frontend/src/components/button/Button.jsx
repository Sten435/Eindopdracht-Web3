import { Link } from 'react-router-dom';

const Button = ({ text, to = null, style = {}, children, click }) => {
	return !to ? (
		<button
			click={click}
			className='button'
			style={style}>
			{children ?? text}
		</button>
	) : (
		<Link to={to}>
			<button
				click={click}
				className='button'
				style={style}>
				{children ?? text}
			</button>
		</Link>
	);
};

export default Button;
