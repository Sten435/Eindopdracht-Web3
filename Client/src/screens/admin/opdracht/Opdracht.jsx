import React, { useEffect, useRef, useState } from 'react';
import { FaCheck, FaHashtag, FaTimes, FaTrash } from 'react-icons/fa';
import Button from '../../../components/button/Button';
import CountdownTimer from '../../../components/counter/CountdownTimer';
import Header from '../../../components/header/Header';
import InputText from '../../../components/inputText/InputText';
import Section from '../../../components/section/Section';
import Fetch from '../../../controller/fetch';
import LoadPage from '../../../controller/loadPage';
import { socket } from '../../../controller/socket';

const Student = () => {
	const [geselecteerdeOpdrachtNaam, setGeselecteerdeOpdrachtNaam] = useState();
	const [geselecteerdeTijd, setGeselecteerdeTijd] = useState();

	const { response, updateScreen, loading, error, user } = LoadPage('opdrachten', 'GET');

	const nieuweOpdrachtNaamRef = useRef();
	const nieuweOpdrachtBeschrijvingRef = useRef();
	const nieuweOpdrachtSecondenRef = useRef();

	const maakNieuwOpdracht = async () => {
		const naam = nieuweOpdrachtNaamRef.current.value;
		const beschrijving = nieuweOpdrachtBeschrijvingRef.current.value;
		const minuten = nieuweOpdrachtSecondenRef.current.value;

		if (naam.trim() === '' || !naam) return;
		if (beschrijving.trim() === '' || !beschrijving) return;
		if (minuten.trim() === '' || !minuten) return;

		const result = await Fetch('opdrachten/maak', 'POST', { naam, beschrijving, seconden: minuten * 60 });

		updateScreen();
		opdrachtenGewijzigd();

		return { error: result.error, message: result.message };
	};

	const removeOpdracht = async (id) => {
		if (!id) return;
		const result = await Fetch(`opdrachten/${id}`, 'DELETE', { opdrachtId: id });
		if (result.error) return alert(result.message);

		socket.emit('toClient', { opdrachtId: id, action: 'removeOpdracht' });

		setGeselecteerdeOpdrachtNaam(response.opdrachten[Object.keys(response.opdrachten)[0]].naam);
		updateScreen();
		opdrachtenGewijzigd();
	};

	const wijzigExtraTijdVragen = async (id) => {
		if (!id) return;
		const result = await Fetch('opdrachten/wijzigExtraTijdVragen', 'POST', { opdrachtId: id });
		if (result.error) return alert(result.message);

		updateScreen();
		opdrachtenGewijzigd();
	};

	const comboBoxSelectionChanged = (e) => {
		const opdrachtNaam = e.target.value;
		setGeselecteerdeOpdrachtNaam(opdrachtNaam);
	};

	const updateOpdracht = (opdrachtId, beschrijving) => {
		if (!opdrachtId || !beschrijving) return;

		const result = Fetch(`opdrachten/update/${opdrachtId}`, 'POST', { beschrijving });
		if (result.error) return alert(result.message);

		updateScreen();
		opdrachtenGewijzigd();
	};

	const wijzigMinuten = (opdrachtId, minuten) => {
		if (!opdrachtId || !minuten) return;

		const result = Fetch(`opdrachten/update/${opdrachtId}`, 'POST', { minuten: minuten / 60 });
		if (result.error) return alert.info(result.message);

		updateScreen();
		opdrachtenGewijzigd();
	};

	const opdrachtenGewijzigd = () => {
		socket.emit('toClient', { action: 'refreshData' });
	};

	useEffect(() => {
		if (!response) return;
		if (Object.keys(response.opdrachten).length === 0) return;
		if (!geselecteerdeOpdrachtNaam) {
			const naam = Object.keys(response.opdrachten)[0];
			setGeselecteerdeOpdrachtNaam(naam);
		}

		socket.on('refreshData', updateScreen);

		return () => socket.off();
	}, [response]);

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading) return <p>Loading... loading</p>;
	if (!response) return <p>Loading... response</p>;

	const { opdrachten } = response;

	const zijnErOpdrachten = Object.keys(opdrachten).length > 0;

	return (
		<>
			<Header
				title='Admin Opdracht'
				metTerugButton
				name={user.voorNaam + ' ' + user.familieNaam}
			/>
			<Section noLine>
				<div className='flex flex-col'>
					<form
						onSubmit={async (e) => {
							e.preventDefault();

							const { error, message } = await maakNieuwOpdracht();
							if (error) alert.error(message);

							if (!error) e.target.reset();
						}}>
						<h2 className='mt-10 mb-2 text-gray-700 font-bold text-2xl self-start'>Nieuwe Opdracht</h2>
						<InputText
							placeholder='Naam'
							referace={nieuweOpdrachtNaamRef}
						/>
						<InputText
							className='mt-4'
							placeholder='Beschrijving'
							referace={nieuweOpdrachtBeschrijvingRef}
						/>
						<InputText
							placeholder='Minuten'
							className='mt-4'
							numberOnly
							referace={nieuweOpdrachtSecondenRef}
						/>
						<Button
							text='Maak'
							className='text-xl mt-10 mb-5 text-slate-200 bg-gray-800 w-full'
						/>
					</form>
					{!zijnErOpdrachten && (
						<>
							<hr className='mt-4' />
							<p className=' text-gray-700 font-bold text-2xl'>Er zijn geen opdrachten</p>
						</>
					)}
					{zijnErOpdrachten && (
						<>
							<h2 className='mt-10 text-gray-700 font-bold text-2xl'>Kies een opdracht</h2>
							<select
								className='mb-4 mt-2 p-2 text-2xl w-fit rounded focus:outline-none'
								onChange={comboBoxSelectionChanged}
								value={geselecteerdeOpdrachtNaam}>
								{Object.keys(opdrachten)?.map((key, index) => (
									<option
										key={index}
										value={key}>
										{key} ({opdrachten[key].length})
									</option>
								))}
							</select>
							<div className='mt-2 mb-[1rem] overflow-hidden overflow-x-auto rounded border border-gray-200'>
								<table className='min-w-full divide-y divide-gray-200 bg-gray-100 text-sm'>
									<thead className='border-b-2 border-gray-200'>
										<tr className='bg-gray-100'>
											<th className='px-4 py-2 text-left font-extrabold text-gray-900'>Beschrijving</th>
											<th className='px-4 py-2 text-center font-extrabold text-gray-900'>Startdatum</th>
											<th className='px-4 py-2 text-center font-extrabold text-gray-900'>Seconden</th>
											<th className='px-4 py-2 text-center font-extrabold text-gray-900'>ExtraTijd</th>
											<th className='px-4 py-2 text-left font-extrabold text-gray-900'>Delete</th>
										</tr>
									</thead>
									<tbody>
										{geselecteerdeOpdrachtNaam &&
											opdrachten[geselecteerdeOpdrachtNaam]?.map((opdracht, index) => {
												return (
													<tr
														key={index}
														className='odd:bg-gray-100 even:bg-gray-200 relative hover:text-white hover:bg-gray-700 transition-colors duration-100 cursor-pointer'>
														<td
															className='pr-6 pl-5 py-2 max-w-prose cursor-text select-none focus:border-dashed focus:bg-orange-200 focus:font-medium focus:text-gray-700 focus:outline-none'
															onBlur={(e) => {
																e.target.contentEditable = false;
																updateOpdracht(opdracht.id, e.target.innerText);
															}}
															onClick={(e) => {
																e.target.contentEditable = true;
																e.target.focus();
															}}>
															{opdracht.beschrijving}
														</td>
														<td className='px-4 py-2 text-center'>
															{opdracht.startDatum ? (
																new Date(opdracht.startDatum).toLocaleString()
															) : (
																<FaHashtag
																	className='inline'
																	opacity={0.2}
																	size={14}
																/>
															)}
														</td>
														<td className='px-4 py-2 text-center'>
															{opdracht.seconden ? (
																<span
																	onBlur={(e) => {
																		if (opdracht.startDatum) return;

																		e.target.contentEditable = false;
																		const seconden = e.target.innerText;

																		if (geselecteerdeTijd === seconden) return;
																		if (!parseInt(seconden) || seconden.trim() === '') return alert.error('Geen geldige tijd');

																		wijzigMinuten(opdracht.id, seconden);
																		alert('Tijd gewijzigd');
																	}}
																	onClick={(e) => {
																		if (opdracht.startDatum) return;
																		setGeselecteerdeTijd(e.target.innerText);

																		e.target.contentEditable = true;
																		e.target.focus();
																	}}>
																	<CountdownTimer
																		className='p-2'
																		start={opdracht.startDatum}
																		onEnd={updateScreen}
																		inSeconds
																		seconden={opdracht.seconden}
																	/>
																</span>
															) : (
																<FaHashtag
																	className='inline'
																	opacity={0.2}
																	size={14}
																/>
															)}
														</td>
														<td className='px-4 py-2 text-center'>
															{opdracht.seconden ? (
																opdracht.kanStudentExtraTijdVragen ? (
																	<FaCheck
																		onClick={() => wijzigExtraTijdVragen(opdracht.id)}
																		className='inline bg-green-500 rounded text-white p-1 hover:scale-110 hover:bg-white hover:text-green-500 transition-transform duration-100 hover:green-red-500'
																		size={30}
																	/>
																) : (
																	<FaTimes
																		onClick={() => wijzigExtraTijdVragen(opdracht.id)}
																		className='inline bg-red-500 rounded text-white p-1 hover:scale-110 hover:bg-white hover:text-red-500 transition-transform duration-100 hover:green-red-500'
																		size={30}
																	/>
																)
															) : (
																<FaHashtag
																	className='inline'
																	opacity={0.2}
																	size={14}
																/>
															)}
														</td>
														<td className='px-4 py-2 text-center cursor-pointer'>
															<FaTrash
																className='inline bg-red-500 rounded text-white p-[.4rem] hover:scale-110 hover:bg-white transition-transform duration-100 hover:text-red-500'
																size={30}
																onClick={() => removeOpdracht(opdracht.id)}
															/>
														</td>
													</tr>
												);
											})}
									</tbody>
								</table>
							</div>
						</>
					)}
				</div>
			</Section>
		</>
	);
};

export default Student;
