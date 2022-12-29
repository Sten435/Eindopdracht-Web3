import React from 'react';
import style from './rapport.module.css';

const Rapport = (rapport) => {
	const { studentNaam, status, extraTijd, vragen } = rapport;

	const randomSeed = (Math.random() + 1).toString(36).substring(7);
	const randomRotation = Math.floor(Math.random() * (360 - 320 + 1)) + 0;
	let statusColor = status === 'bezig' ? 'bg-orange-400' : '';
	statusColor = status === 'ik doe niet mee' ? 'bg-blue-400' : statusColor;
	statusColor = status === 'ik geef op' ? 'bg-red-400' : statusColor;
	statusColor = status === 'ik ben klaar' ? 'bg-green-400' : statusColor;

	return (
		<>
			<div className={style.rapportContainer}>
				<div>
					<div className="mb-4">
						<span className="mr-1">Status:</span>
						<span className={'pb-1 pl-2 pr-2 pt-1 text-gray-50 font-bold rounded-md ' + statusColor}>{status}</span>
					</div>
					<div className="mb-4">
						<span className="mr-1">Extra tijd:</span>
						<span className="pb-1 pl-2 pr-2 pt-1 text-gray-50 font-bold rounded-md bg-gray-500">{extraTijd ? extraTijd + ' min' : '/'}</span>
					</div>

					<span className="mt-4">Vragen:</span>
					{vragen?.length === 0 ? <span className={'pb-1 pl-2 pr-2 pt-1 ml-2 text-white bg-gray-500 font-bold rounded-md ' + statusColor}>/</span> : ''}
					{vragen?.length > 0 && (
						<>
							<ul className="mt-2">
								{vragen.map((vraag, index) => {
									return (
										<li className="list-item list-inside list-disc" key={index}>
											{vraag}
										</li>
									);
								})}
							</ul>
						</>
					)}
				</div>
				<div className={style.infoContainer}>
					<span className="underline">{studentNaam.toUpperCase()}</span>
					<img className={style.img} src={`https://avatars.dicebear.com/api/miniavs/${randomSeed}.svg?&scale=88&rotate=${randomRotation}&translateX=3`} alt="face" />
				</div>
			</div>
		</>
	);
};

export default Rapport;
