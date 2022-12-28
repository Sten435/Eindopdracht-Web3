const Section = ({ children, title, className, noLine }) => {
	return (
		<section className={'section pb-4 ' + className ?? ''}>
			{title && <h2 className="text-2xl pb-2">{title}</h2>}
			{!noLine && <hr />}
			{children}
		</section>
	);
};

export default Section;
