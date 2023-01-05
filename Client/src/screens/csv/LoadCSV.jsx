import React from 'react';
import Header from '../../components/header/Header';
import Loading from '../loading/Loading';
import LoadPage from '../../controller/loadPage';
import Fetch from '../../controller/fetch';
import Papa from 'papaparse';
import { socket } from '../../controller/socket';

const LoadCSV = ({ type }) => {
	const { loading, error } = LoadPage();

	if (loading) return <Loading />;
	if (error) return <p>error check console...</p>;

	const onUpload = async (e) => {
		const result = [];

		Papa.parse(e.target.files[0], {
			worker: true,
			step: (row) => {
				result.push(row.data);
			},
			complete: async () => {
				const data = await Fetch('/import/csv/' + type, 'POST', { file: result });
				if (data.error) return alert(data.error);

				socket.emit('toClient', { action: 'refreshData' });
			},
		});
	};

	return (
		<>
			<main>
				<Header
					title='Import csv'
					metTerugButton
					name={'type: ' + type}
				/>
				<div className='flex items-center justify-center w-full'>
					<label
						htmlFor='dropzone-file'
						className='flex flex-col items-center justify-center w-full p-5 border-2 border-gray-300 border-dashed rounded cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 relative'>
						<div className='flex flex-col items-center justify-center'>
							<svg
								aria-hidden='true'
								className='w-10 h-10 mb-3 text-gray-400'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'></path>
							</svg>
							<p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
								<span className='font-semibold'>Click to upload</span>
							</p>
							<p className='text-xs text-gray-500 dark:text-gray-400'>*.CSV</p>
						</div>
						<input
							id='dropzone-file'
							type='file'
							className='hidden'
							onChange={onUpload}
						/>
					</label>
				</div>
			</main>
		</>
	);
};

export default LoadCSV;
