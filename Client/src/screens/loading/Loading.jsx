import Header from '../../components/header/Header';

const Loading = () => {
	let circleCommonClasses = 'h-10 w-10 bg-gray-700 rounded-full';

	return (
		<main className='h-screen'>
			<Header />
			<div className='flex justify-center items-center w-full h-full'>
				<div className={`${circleCommonClasses} mr-10 animate-bounce`}></div>
				<div className={`${circleCommonClasses} mr-10 animate-bounce200`}></div>
				<div className={`${circleCommonClasses} animate-bounce400`}></div>
			</div>
		</main>
	);
};

export default Loading;
