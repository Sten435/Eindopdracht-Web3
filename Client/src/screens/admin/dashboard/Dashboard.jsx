import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Header from '../../../components/header/Header';
import LoadPage from '../../../controller/loadPage';

const Dashboard = () => {
	const { loading, error, user } = LoadPage();
	const navigate = useNavigate();

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading) return <p>Loading...</p>;

	return (
		<>
			<main>
				<Header
					title='Admin'
					name={user.voorNaam + ' ' + user.familieNaam}
				/>
				<h1 className='text-4xl text-gray-700 font-bold mt-10'>Wat wil je veranderen: </h1>
				<div className='flex flex-col items-center w-full gap-4 p-8 mb-8 md:flex-col md:mb-0 flex-between'>
					<div
						onClick={() => navigate('/admin/opdracht')}
						className='bg-white dark:bg-gray-700 w-80 shadow-lg mx-auto mt-8 rounded-xl p-4 hover:underline cursor-pointer underline-offset-2 decoration-white decoration-2'>
						<h1 className='text-center text-white text-2xl font-bold'>Opdracht</h1>
					</div>
					<div
						onClick={() => navigate('/admin/groep')}
						className='bg-white dark:bg-gray-700 w-80 shadow-lg mx-auto mt-8 rounded-xl p-4 hover:underline cursor-pointer underline-offset-2 decoration-white decoration-2'>
						<h1 className='text-center text-white text-2xl font-bold'>Groep</h1>
					</div>
					<div
						onClick={() => navigate('/admin/student')}
						className='bg-white dark:bg-gray-700 w-80 shadow-lg mx-auto mt-8 rounded-xl p-4 hover:underline cursor-pointer underline-offset-2 decoration-white decoration-2'>
						<h1 className='text-center text-white text-2xl font-bold'>Student</h1>
					</div>
				</div>
				<hr style={{ width: '100%' }} />
				<h1 className='text-4xl text-gray-700 font-bold mt-10'>Import Csv:</h1>
				<span
					onClick={() => navigate('/import/opdracht')}
					className='bg-white dark:bg-gray-700 w-80 shadow-lg mx-auto mt-8 rounded-xl p-4 hover:underline cursor-pointer underline-offset-2 decoration-white decoration-2'>
					<h1 className='text-center text-white text-2xl font-bold'>Opdracht</h1>
				</span>
				<div
					onClick={() => navigate('/import/student')}
					className='bg-white dark:bg-gray-700 w-80 shadow-lg mx-auto mt-8 rounded-xl p-4 hover:underline cursor-pointer underline-offset-2 decoration-white decoration-2'>
					<h1 className='text-center text-white text-2xl font-bold'>Student</h1>
				</div>
			</main>
		</>
	);
};

export default Dashboard;
