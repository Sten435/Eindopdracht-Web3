import React from 'react';
import Header from '../../../components/header/Header';
import InputText from '../../../components/inputText/InputText';
import Button from '../../../components/button/Button';
import LoadPage from '../../../controller/loadPage';
import { useRef } from 'react';
import Fetch from '../../../controller/fetch';
import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useEffect } from 'react';

const Opdracht = () => {
	const [geselecteerdeOpdrachtNaam, setGeselecteerdeOpdrachtNaam] = useState();

	const { response, setResponse, loading, error, user } = LoadPage('opdrachten', 'GET');

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
		if (result.error) return alert(result.message);
	};

	const clickOnOpdrachtRow = (id) => {};

	const wijzigExtraTijdVragen = async (id) => {
		if (!id) return;
		const result = await Fetch('opdrachten/wijzigExtraTijdVragen', 'POST', { opdrachtId: id });
		if (result.error) return alert(result.message);

		const result2 = await Fetch(`/opdrachten`, 'GET');
		setResponse(result2);
	};

	const comboBoxSelectionChanged = (e) => {
		const opdrachtNaam = e.target.value;
		setGeselecteerdeOpdrachtNaam(opdrachtNaam);
	};

	useEffect(() => {
		if (!response) return;
		const naam = Object.keys(response.opdrachten)[0];
		setGeselecteerdeOpdrachtNaam(naam);
	}, [response]);

	if (error) return <p>Er is iets fout gegaan</p>;
	if (loading) return <p>Loading... loading</p>;
	if (!response) return <p>Loading... response</p>;
	if (!geselecteerdeOpdrachtNaam) return <p>Loading... geselecteerdeOpdrachtNaam</p>;

	const { opdrachten } = response;
	const eersteOpdracht = Object.keys(opdrachten)[0];

	return (
		opdrachten &&
		geselecteerdeOpdrachtNaam && (
			<main>
				<Header
					title='Admin Opdracht'
					name={user.voorNaam + ' ' + user.familieNaam}
				/>
				<div className='flex flex-col'>
					<h2 className='mt-10 text-gray-700 font-bold text-2xl'>Nieuwe Opdracht</h2>
					<div className='flex mt-2'>
						<div>
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
								click={maakNieuwOpdracht}
								text='Maak'
								className='text-xl mt-10 mb-5 text-slate-200 bg-gray-800 w-full'
							/>
						</div>
					</div>
					<select
						className='mb-4 mt-20 pr-2 pl-2 text-2xl w-fit rounded'
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
									<th className='px-4 py-2 text-left font-medium text-gray-900'>Beschrijving</th>
									<th className='px-4 py-2 text-left font-medium text-gray-900'>Startdatum</th>
									<th className='px-4 py-2 text-left font-medium text-gray-900'>ExtraTijd</th>
									<th className='px-4 py-2 text-left font-medium text-gray-900'>Status</th>
									<th className='px-4 py-2 text-left font-medium text-gray-900'>Gestopt</th>
								</tr>
							</thead>
							<tbody>
								{opdrachten[geselecteerdeOpdrachtNaam ?? eersteOpdracht].map((opdracht, index) => {
									return (
										<tr
											key={index}
											className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} hover:text-white hover:bg-gray-700 cursor-pointer`}
											onClick={() => clickOnOpdrachtRow(opdracht.id)}>
											<td
												className='px-4 py-2 max-w-prose cursor-text select-none'
												onMouseLeave={(e) => (e.target.contentEditable = false)}
												onClick={(e) => (e.target.contentEditable = true)}>
												{opdracht.beschrijving}
											</td>
											<td className='px-4 py-2 text-center'>{opdracht.startDatum ? new Date(opdracht.startDatum).toLocaleString() : '/'}</td>
											<td
												className='px-4 py-2 text-center'
												onClick={() => wijzigExtraTijdVragen(opdracht.id)}>
												{opdracht.kanStudentExtraTijdVragen ? (
													<FaCheckCircle
														className='inline'
														size={26}
													/>
												) : (
													<FaTimesCircle
														className='inline'
														size={26}
													/>
												)}
											</td>
											<td className='px-4 py-2 text-center'>{opdracht.status}</td>
											<td className='px-4 py-2 text-center'>
												{opdracht.gestoptDoorHost ? (
													<FaCheckCircle
														className='inline'
														size={26}
													/>
												) : (
													<FaTimesCircle
														className='inline'
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
				</div>
			</main>
		)
	);
};

export default Opdracht;
