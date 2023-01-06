import { insertOpdrachtInDb, insertStudentenInDb } from '../database/repositorys/csv_repo.js';
import { getOpdrachtByNaamEnBeschrijving } from '../controllers/opdrachten_controller.js';
import { encryptCode } from './studenten_controller.js';

export const insertOpdracht = async (opdrachten) => {
	opdrachten = opdrachten
		.map((opdracht, index) => {
			if (index === 0) return;
			return {
				naam: opdracht[0],
				// naam: opdracht[1],
				beschrijving: opdracht[2],
				seconden: opdracht[3] * 60,
				startDatum: null,
				kanStudentExtraTijdVragen: true,
			};
		})
		.filter((o) => o !== undefined) // verwijder header van csv
		.filter((o) => o.naam && o.beschrijving && o.seconden); // verwijder opdrachten die lege rijen bevatten

	opdrachten.filter(async (opdracht) => {
		if (!opdracht.naam || !opdracht.beschrijving || !opdracht.seconden) return false;
		if (opdracht.seconden < 0) return false;

		const bestaatOpdracht = await getOpdrachtByNaamEnBeschrijving(opdracht.naam, opdracht.beschrijving);
		if (bestaatOpdracht.found) return false;

		return true;
	});

	await insertOpdrachtInDb(opdrachten);
};

export const insertStudent = async (studenten) => {
	studenten = studenten
		.map((student, index) => {
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
		})
		.filter((s) => s !== undefined) // verwijder header van csv
		.filter((s) => s.password && s.gebruikersNaam && s.familieNaam && s.voorNaam && s.sorteerNaam && s.email); // verwijder studenten die lege rijen bevatten

	await insertStudentenInDb(studenten);
};
