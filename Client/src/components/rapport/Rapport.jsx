import React from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import style from './rapport.module.css';
import Fetch from '../../controller/fetch';
import { socket } from '../../controller/socket';

const Rapport = (rapport) => {
	const { id: opdrachtId } = useParams();

	const randomRotation = Math.floor(Math.random() * (360 - 320 + 1)) + 0;
	const [image] = useState(`https://avatars.dicebear.com/api/avataaars/${rapport.studentNaam}.svg?options[mood][]=happy&options[rotation]=${randomRotation}`);

	const { studentId, studentNaam, status, extraTijd, vragen, closeAction, metSluitIcon = null } = rapport;

	let statusColor = status === 'bezig' ? 'bg-orange-400' : '';
	statusColor = status === 'ik doe niet mee' ? 'bg-blue-400' : statusColor;
	statusColor = status === 'ik geef op' ? 'bg-red-400' : statusColor;
	statusColor = status === 'ik ben klaar' ? 'bg-green-400' : statusColor;

	const removeRapport = async () => {
		const result = await Fetch(`rapporten/${opdrachtId}/${studentId}`, 'DELETE');
		if (result.error) alert(result.message);

		closeAction();

		socket.emit('toClient', { opdrachtId, userId: studentId, action: 'removeRapport' });
	};

	return (
		<div className='relative'>
			{metSluitIcon && (
				<div
					className='absolute -top-1 -right-2 p-1 bg-red-500 rounded-full text-white hover:scale-125 cursor-pointer'
					onClick={removeRapport}>
					<FaTimes />
				</div>
			)}
			<div className={style.rapportContainer}>
				<div>
					<div className='mb-4'>
						<span className='mr-1'>Status:</span>
						<span className={'pb-1 pl-2 pr-2 pt-1 text-gray-50 font-bold rounded ' + statusColor}>{status}</span>
					</div>
					<div className='mb-4'>
						<span className='mr-1'>Extra tijd:</span>
						<span className='pb-1 pl-2 pr-2 pt-1 text-gray-50 font-bold rounded bg-gray-500'>{extraTijd ? extraTijd + ' min' : '/'}</span>
					</div>

					<span className='mt-4'>Vragen:</span>
					{vragen?.length === 0 ? <span className={'pb-1 pl-2 pr-2 pt-1 ml-2 text-white bg-gray-500 font-bold rounded ' + statusColor}>/</span> : ''}
					{vragen?.length > 0 && (
						<>
							<ul className='mt-2'>
								{vragen.map((vraag, index) => {
									return (
										<li
											className='list-item list-inside list-disc'
											key={index}>
											{vraag}
										</li>
									);
								})}
							</ul>
						</>
					)}
				</div>
				<div className={style.infoContainer}>
					<span className='underline'>{studentNaam.toUpperCase()}</span>
					<img
						className={style.img}
						src={image}
						alt='face'
					/>
				</div>
			</div>
		</div>
	);
};

export default Rapport;
