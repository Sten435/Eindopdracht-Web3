const Section = ({ children, title, className = '', noLine }) => {
	return (
		<section className={`section pb-4 ${className}`}>
			{title && <h2 className='mt-10 mb-2 text-gray-700 font-bold text-2xl self-start'>{title}</h2>}
			{!noLine && <hr />}
			{children}
		</section>
	);
};

export default Section;
