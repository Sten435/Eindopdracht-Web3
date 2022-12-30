import { insertOpdrachtInDb, insertStudentenInDb } from '../database/repositorys/csv_repo.js';
import { encryptCode } from './user_controller.js';

export const insertOpdracht = async (opdrachten) => {
	opdrachten = opdrachten
		.map((opdracht, index) => {
			if (index === 0) return;
			return {
				naam: opdracht[0],
				// naam: opdracht[1],
				beschrijving: opdracht[2],
				seconden: opdracht[3] * 60,
				verwijderd: false,
				startDatum: null,
			};
		})
		.filter((o) => o !== undefined) // verwijder header van csv
		.filter((o) => o.naam && o.beschrijving && o.seconden); // verwijder opdrachten die lege rijen bevatten

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
				cursusGroep: student[9]?.split(' ')[1] ?? '',
			};
		})
		.filter((s) => s !== undefined) // verwijder header van csv
		.filter((s) => s.password && s.gebruikersNaam && s.familieNaam && s.voorNaam && s.sorteerNaam && s.email); // verwijder studenten die lege rijen bevatten

	await insertStudentenInDb(studenten);
};
