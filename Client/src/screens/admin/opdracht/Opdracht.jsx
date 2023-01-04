import React from 'react';
import Header from '../../../components/header/Header';
import InputText from '../../../components/inputText/InputText';
import Button from '../../../components/button/Button';
import LoadPage from '../../../controller/loadPage';
import { useRef } from 'react';
import Fetch from '../../../controller/fetch';
import { useState } from 'react';
import { FaCheck, FaCheckCircle, FaHashtag, FaTimesCircle, FaTrash } from 'react-icons/fa';
import { useEffect } from 'react';
import Section from '../../../components/section/Section';

const Student = () => {
	const [geselecteerdeOpdrachtNaam, setGeselecteerdeOpdrachtNaam] = useState();

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

		return result.error;
	};

	const removeOpdracht = async (id) => {
		if (!id) return;
		const result = await Fetch(`opdrachten/${id}`, 'DELETE', { opdrachtId: id });
		if (result.error) return alert(result.message);

		updateScreen();
	};

	const wijzigExtraTijdVragen = async (id) => {
		if (!id) return;
		const result = await Fetch('opdrachten/wijzigExtraTijdVragen', 'POST', { opdrachtId: id });
		if (result.error) return alert(result.message);

		updateScreen();
	};

	const comboBoxSelectionChanged = (e) => {
		const opdrachtNaam = e.target.value;
		setGeselecteerdeOpdrachtNaam(opdrachtNaam);
	};

	const stopOpdracht = async (id, gestopt) => {
		if (!id || gestopt === true || gestopt === undefined) return;

		const actie = 'stop';

		const result = await Fetch(`opdrachten/${actie}`, 'POST', { opdrachtId: id });
		if (result.error) return alert(result.message);

		updateScreen();
	};

	useEffect(() => {
		if (!response) return;
		if (Object.keys(response.opdrachten).length === 0) return;
		if (!geselecteerdeOpdrachtNaam) {
			const naam = Object.keys(response.opdrachten)[0];
			setGeselecteerdeOpdrachtNaam(naam);
		}
	}, [response]);

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading) return <p>Loading... loading</p>;
	if (!response) return <p>Loading... response</p>;

	const { opdrachten } = response;

	const zijnErOpdrachten = Object.keys(opdrachten).length > 0;

	if (geselecteerdeOpdrachtNaam && !Object.keys(opdrachten).includes(geselecteerdeOpdrachtNaam)) return setGeselecteerdeOpdrachtNaam(null);

	return (
		<>
			<Header
				title='Admin Opdracht'
				name={user.voorNaam + ' ' + user.familieNaam}
			/>
			<Section>
				<div className='flex flex-col'>
					<form
						onSubmit={(e) => {
							const error = maakNieuwOpdracht();

							e.preventDefault();

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
								className='mb-4 mt-2 pr-2 pl-2 text-2xl w-fit rounded'
								onChange={comboBoxSelectionChanged}
								defaultValue={geselecteerdeOpdrachtNaam}>
								{Object.keys(opdrachten).map((key, index) => (
									<option
										key={index}
										value={key}>
										{key}
									</option>
								))}
							</select>
							<div className='mt-2 mb-[1rem] overflow-hidden overflow-x-auto rounded-lg border border-gray-200'>
								<table className='min-w-full divide-y divide-gray-200 bg-gray-100 text-sm'>
									<thead>
										<tr className='bg-gray-100'>
											<th className='px-4 py-2 text-left font-medium text-gray-900'></th>
											<th className='px-4 py-2 text-left font-medium text-gray-900'>Beschrijving</th>
											<th className='px-4 py-2 text-center font-medium text-gray-900'>Startdatum</th>
											<th className='px-4 py-2 text-center font-medium text-gray-900'>Minuten</th>
											<th className='px-4 py-2 text-center font-medium text-gray-900'>ExtraTijd</th>
											<th className='px-4 py-2 text-center font-medium text-gray-900'>Status</th>
											<th className='px-4 py-2 text-center font-medium text-gray-900'>Gestopt</th>
										</tr>
									</thead>
									<tbody>
										{geselecteerdeOpdrachtNaam &&
											opdrachten[geselecteerdeOpdrachtNaam].map((opdracht, index) => {
												return (
													<tr
														key={index}
														className='odd:bg-gray-100 even:bg-gray-200 relative group/row hover:text-white hover:bg-gray-700 transition-colors duration-100 cursor-pointer'>
														<td className='px-4 pl-4 pr-0 py-2 text-center hover:bg-gray-700 cursor-pointer'>
															<FaTrash
																className='inline hover:scale-110 transition-transform duration-100 hover:text-red-400'
																size={14}
																onClick={() => removeOpdracht(opdracht.id)}
															/>
														</td>
														<td
															className='px-4 py-2 max-w-prose cursor-text select-none'
															onMouseLeave={(e) => (e.target.contentEditable = false)}
															onClick={(e) => (e.target.contentEditable = true)}>
															{opdracht.beschrijving}
														</td>
														<td className='px-4 py-2 text-center'>
															{opdracht.startDatum ? (
																new Date(opdracht.startDatum).toLocaleString()
															) : (
																<FaHashtag
																	className='inline'
																	size={14}
																/>
															)}
														</td>
														<td className='px-4 py-2 text-center'>
															{opdracht.seconden ? (
																(opdracht.seconden / 60).toFixed(1)
															) : (
																<FaHashtag
																	className='inline'
																	size={14}
																/>
															)}
														</td>
														<td
															className='px-4 py-2 text-center'
															onClick={() => wijzigExtraTijdVragen(opdracht.id)}>
															{opdracht.seconden ? (
																opdracht.kanStudentExtraTijdVragen ? (
																	<FaCheckCircle
																		className='inline hover:scale-110 transition-transform duration-100 hover:text-green-400'
																		size={26}
																	/>
																) : (
																	<FaTimesCircle
																		className='inline hover:scale-110 transition-transform duration-100 hover:text-red-400'
																		size={26}
																	/>
																)
															) : (
																<FaHashtag
																	className='inline'
																	size={14}
																/>
															)}
														</td>
														<td className='px-4 py-2 text-center'>{opdracht.status}</td>
														<td
															className='px-4 py-2 text-center'
															onClick={() => stopOpdracht(opdracht.id, opdracht.gestoptDoorHost)}>
															{opdracht.gestoptDoorHost ? (
																<FaCheck
																	className='inline cursor-not-allowed'
																	size={20}
																/>
															) : (
																<FaTimesCircle
																	className='inline cursor-hover hover:text-red-400'
																	size={26}
																/>
															)}
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
