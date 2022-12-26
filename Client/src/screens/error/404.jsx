import style from './404.module.css';

const Error = () => {
	return (
		<main style={{ justifyContent: 'center' }}>
			<div className={style.titleContainer}>
				<h1 className={style.title}>Pagina niet gevonden</h1>
			</div>
		</main>
	);
};

export default Error;
