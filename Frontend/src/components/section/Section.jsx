const Section = ({ children, title, noLine }) => {
	return (
		<section className='section'>
			<h2>{title}</h2>
			{!noLine && <hr />}
			{children}
		</section>
	);
};

export default Section;
