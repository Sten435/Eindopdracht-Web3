import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/header/Header';
import LoadPage from '../../../controller/loadPage';
import Loading from '../../loading/Loading';

const Dashboard = () => {
	const { loading, error, user } = LoadPage();
	const navigate = useNavigate();

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading) return <Loading />;

	return (
		<>
			<main>
				<Header
					title='Admin'
					metLogoutButton
					name={user.voorNaam + ' ' + user.familieNaam}
				/>
				<div className='flex flex-col sm:flex-row justify-evenly w-full'>
					<div>
						<h1 className='text-5xl text-center underline text-gray-700 font-bold mt-10 drop-shadow-sm'>Beheer</h1>
						<div className='flex flex-col items-center w-full'>
							<div
								onClick={() => navigate('/admin/opdracht')}
								className='bg-white dark:bg-gray-700 w-60 shadow-lg mx-auto mt-8 rounded p-4 hover:underline cursor-pointer underline-offset-2 decoration-white decoration-2'>
								<h1 className='text-center text-white text-xl font-bold drop-shadow-sm'>Opdracht</h1>
							</div>
							<div
								onClick={() => navigate('/admin/student')}
								className='bg-white dark:bg-gray-700 w-60 shadow-lg mx-auto mt-8 rounded p-4 hover:underline cursor-pointer underline-offset-2 decoration-white decoration-2'>
								<h1 className='text-center text-white text-xl font-bold drop-shadow-sm'>Student</h1>
							</div>
						</div>
					</div>
					<div>
						<h1 className='text-5xl text-center underline text-gray-700 font-bold mt-10 drop-shadow-sm'>Import CSV</h1>
						<div className='flex flex-col items-center w-full'>
							<div
								onClick={() => navigate('/import/opdracht')}
								className='bg-white dark:bg-gray-700 w-60 shadow-lg mx-auto mt-8 rounded p-4 hover:underline cursor-pointer underline-offset-2 decoration-white decoration-2'>
								<h1 className='text-center text-white text-xl font-bold drop-shadow-sm'>Opdracht</h1>
							</div>
							<div
								onClick={() => navigate('/import/student')}
								className='bg-white dark:bg-gray-700 w-60 shadow-lg mx-auto mt-8 rounded p-4 hover:underline cursor-pointer underline-offset-2 decoration-white decoration-2'>
								<h1 className='text-center text-white text-xl font-bold drop-shadow-sm'>Student</h1>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default Dashboard;
