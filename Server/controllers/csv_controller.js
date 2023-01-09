import { insertOpdrachtInDb, insertStudentenInDb } from '../database/repositorys/csv_repo.js';
import { getOpdrachtByNaamEnBeschrijving } from '../controllers/opdrachten_controller.js';
import { encryptCode, getStudentByEmail } from './studenten_controller.js';

export const insertOpdracht = async (opdrachten) => {
	opdrachten = opdrachten.map((opdracht, index) => {
		if (index === 0) return;
		return {
			naam: opdracht[0],
			// naam: opdracht[1],
			beschrijving: opdracht[2],
			seconden: opdracht[3] * 60,
			startDatum: null,
			kanStudentExtraTijdVragen: true,
		};
	});

	const nieuweOpdrachten = [];

	for (let index = 0; index < opdrachten.length; index++) {
		const opdracht = opdrachten[index];

		if (!opdracht || !opdracht.naam || !opdracht.beschrijving || !opdracht.seconden) continue;
		if (opdracht.seconden < 0) continue;

		const bestaatOpdracht = await getOpdrachtByNaamEnBeschrijving(opdracht.naam, opdracht.beschrijving);
		if (bestaatOpdracht.found === true) continue;

		nieuweOpdrachten.push(opdracht);
	}

	await insertOpdrachtInDb(nieuweOpdrachten);
};

export const insertStudent = async (studenten) => {
	studenten = studenten.map((student, index) => {
		if (index === 0) return;

		return {
			password: encryptCode(student[0]),
			gebruikersNaam: student[1],
			familieNaam: student[2],
			voorNaam: student[3],
			sorteerNaam: student[4],
			email: student[5],
			cursusGroep: student[9]?.split(' ')[1] === '' ? 'Geen' : student[9]?.split(' ')[1] ?? 'Geen',
		};
	});

	const nieuweStudenten = [];

	for (let index = 0; index < studenten.length; index++) {
		const student = studenten[index];
		if (student && student.password && student.gebruikersNaam && student.familieNaam && student.voorNaam && student.sorteerNaam && student.email && !(await getStudentByEmail(student.email)).found) {
			nieuweStudenten.push(student);
		}
	}

	await insertStudentenInDb(nieuweStudenten);
};
