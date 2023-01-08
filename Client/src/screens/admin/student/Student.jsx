import React from 'react';
import Header from '../../../components/header/Header';
import InputText from '../../../components/inputText/InputText';
import Button from '../../../components/button/Button';
import LoadPage from '../../../controller/loadPage';
import Section from '../../../components/section/Section';
import Fetch from '../../../controller/fetch';

import { useState } from 'react';
import { useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import Loading from '../../loading/Loading';
import { socket } from '../../../controller/socket';

const Student = () => {
	const [geselecteerdeGroep, setGeselecteerdeGroep] = useState('alle groepen');

	const NaamRef = useRef();
	const AchternaamRef = useRef();
	const GebruikersnaamRef = useRef();
	const EmailRef = useRef();
	const WachtwoordRef = useRef();
	const GroepRef = useRef();

	const tBody = useRef();

	const { response, updateScreen, loading, error, user } = LoadPage('studenten', 'GET');

	const maakNieuwOpdracht = async () => {
		const voorNaam = NaamRef.current.value;
		const achternaam = AchternaamRef.current.value;
		const gebruikersnaam = GebruikersnaamRef.current.value;
		const email = EmailRef.current.value;
		const wachtwoord = WachtwoordRef.current.value;
		const groep = GroepRef.current.value;

		if (!voorNaam || !achternaam || !gebruikersnaam || !email || !wachtwoord) return 'Vul alle velden in';

		const response = await Fetch('studenten/maak', 'POST', { voorNaam, achternaam, gebruikersnaam, email, wachtwoord, groep });
		if (response.error) alert.error(response.message);

		updateScreen();

		return response.error;
	};

	const comboBoxSelectionChanged = (e) => {
		const groepNaam = e.target.value;
		setGeselecteerdeGroep(groepNaam);
	};

	const getStudentenVoorGeselecteerdeGroep = (studenten, geselecteerdeGroep) => {
		if (geselecteerdeGroep === 'alle groepen') return studenten;
		return studenten.filter((student) => {
			const groepNaam = student.cursusGroep ? student.cursusGroep : 'geen groep';

			if (groepNaam === geselecteerdeGroep) {
				return true;
			}

			return false;
		});
	};

	const verwijderStudent = async (studentId) => {
		const response = await Fetch(`studenten/verwijder/${studentId}`, 'POST');
		if (response.error) return alert.error(response.message);

		updateScreen();
		refreshDataOnClients();
	};

	const updateStudent = async (studentId, student) => {
		const response = await Fetch(`studenten/update/${studentId}`, 'POST', student);
		if (response.error) return alert.error(response.message);

		updateScreen();
	};

	const clickRow = (e) => {
		e.target.contentEditable = true;
		e.target.focus();
	};

	const exitRow = async (e) => {
		e.target.contentEditable = false;

		const parent = e.target.parentElement;
		const rowData = parent.getElementsByClassName('student-data');
		const id = parent.id;

		const student = {
			voorNaam: rowData[0].innerText,
			familieNaam: rowData[1].innerText,
			sorteerNaam: rowData[2].innerText,
			email: rowData[3].innerText,
			gebruikersNaam: rowData[4].innerText,
			cursusGroep: rowData[5]?.innerText ?? null,
		};

		if (!student.voorNaam || !student.familieNaam || !student.sorteerNaam || !student.email || !student.gebruikersNaam) return alert.error('Vul alle velden in');
		if (!id) return alert.error('Geen id gevonden');

		updateStudent(id, student);
	};

	const refreshDataOnClients = () => {
		socket.emit('toClient', { action: 'refreshData' });
	};

	if (error) return <p>Er is iets fout gegaan: {error}</p>;
	if (loading || !response) return <Loading />;

	const { studenten, groepen } = response;

	if (!studenten || !groepen) return <Loading />;

	if ((geselecteerdeGroep && ![...groepen, 'alle groepen'].includes(geselecteerdeGroep)) || !geselecteerdeGroep) return setGeselecteerdeGroep('alle groepen');

	const zijnErStudenten = groepen.length > 0;
	const filteredData = getStudentenVoorGeselecteerdeGroep(studenten, geselecteerdeGroep);

	return (
		<>
			<Header
				title='ADMIN'
				metTerugButton
				name={user.voorNaam + ' ' + user.familieNaam}
			/>
			<Section noLine>
				<div className='flex flex-col'>
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							const error = await maakNieuwOpdracht();

							if (!error) e.target.reset();
							else alert.error(error.message);
						}}>
						<h2 className='mt-10 mb-2 text-gray-700 font-bold text-2xl self-start'>Nieuwe Student</h2>
						<InputText
							placeholder='Voornaam'
							referace={NaamRef}
						/>
						<InputText
							className='mt-4'
							placeholder='Achternaam'
							referace={AchternaamRef}
						/>
						<InputText
							className='mt-4'
							placeholder='Gebruikersnaam'
							referace={GebruikersnaamRef}
						/>
						<InputText
							className='mt-4'
							placeholder='Email'
							isEmail
							referace={EmailRef}
						/>
						<InputText
							placeholder='Wachtwoord'
							className='mt-4'
							referace={WachtwoordRef}
						/>
						<InputText
							placeholder='Groep'
							className='mt-4'
							referace={GroepRef}
						/>
						<Button
							text='Maak'
							className='text-xl mt-10 mb-5 text-slate-200 bg-gray-800 w-full'
						/>
					</form>
					{!zijnErStudenten && (
						<>
							<hr className='mt-4' />
							<p className=' text-gray-700 font-bold text-2xl'>Er zijn geen studenten</p>
						</>
					)}
					{zijnErStudenten && (
						<>
							<h2 className='mt-10 text-gray-700 font-bold text-2xl'>Kies een groep</h2>
							<select
								className='mb-4 mt-2 pr-2 pl-2 text-2xl w-fit max-w-full rounded'
								value={geselecteerdeGroep ?? 'alle groepen'}
								onChange={comboBoxSelectionChanged}>
								<option
									value='alle groepen'
									defaultValue>
									Alle groepen ({studenten.length})
								</option>
								{groepen
									.sort((a, b) => (!a ? 1 : b ? a - b : -1))
									.map((key, index) => (
										<option
											key={index}
											value={key}>
											{key} ({getStudentenVoorGeselecteerdeGroep(studenten, key).length})
										</option>
									))}
							</select>
							<div className='mt-2 mb-[1rem] overflow-hidden overflow-x-auto rounded border border-gray-200'>
								<table className='min-w-full divide-y divide-gray-200 bg-gray-100 text-sm'>
									<thead>
										<tr className='bg-gray-100'>
											<th className='px-4 py-2 text-left font-medium text-gray-900'>Voornaam</th>
											<th className='px-4 py-2 text-left font-medium text-gray-900'>Familienaam</th>
											<th className='px-4 py-2 text-left font-medium text-gray-900'>Sorteernaam</th>
											<th className='px-4 py-2 text-left font-medium text-gray-900'>Email</th>
											<th className='px-4 py-2 text-left font-medium text-gray-900'>Gebruikersnaam</th>
											{geselecteerdeGroep === 'alle groepen' && <th className='px-4 py-2 text-left font-medium text-gray-900'>Groep</th>}
											<th className='px-4 py-2 text-left font-medium text-gray-900'>Delete</th>
										</tr>
									</thead>
									<tbody ref={tBody}>
										{filteredData.map((student, index) => {
											return (
												<tr
													id={student._id}
													key={index}
													onFocus={clickRow}
													onBlur={exitRow}
													className='odd:bg-gray-100 even:bg-gray-200 relative select-none hover:text-white hover:bg-gray-700 transition-colors duration-100 cursor-text'
													onMouseLeave={(e) => (e.target.contentEditable = false)}
													onClick={(e) => (e.target.contentEditable = true)}>
													<td className='px-4 py-2 student-data'>{student.voorNaam}</td>
													<td className='px-4 py-2 student-data'>{student.familieNaam}</td>
													<td className='px-4 py-2 student-data'>{student.sorteerNaam}</td>
													<td className='px-4 py-2 student-data'>{student.email}</td>
													<td className='px-4 py-2 student-data'>{student.gebruikersNaam}</td>
													{geselecteerdeGroep === 'alle groepen' && <td className='px-4 py-2 student-data'>{student.cursusGroep ?? null}</td>}
													<td className='px-4 py-2 text-center cursor-pointer'>
														<FaTrash
															className='inline bg-red-500 rounded text-white p-[.4rem] hover:scale-110 hover:bg-white transition-transform duration-100 hover:text-red-500'
															size={30}
															onClick={() => verwijderStudent(student._id)}
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
