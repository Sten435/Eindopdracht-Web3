import { createOpdrachtInDb, createStudentInDb } from '../database/repositorys/csv_repo.js';

export const insertOpdracht = (opdracht) => {
	opdracht = opdracht
		.map((opdracht, index) => {
			if (index === 0) return;
			return {
				naam: opdracht[0],
				// naam: opdracht[1],
				beschrijving: opdracht[2],
				minuten: opdracht[3],
			};
		})
		.filter((o) => o !== undefined) // verwijder header van csv
		.filter((o) => o.naam && o.beschrijving && o.minuten); // verwijder opdrachten die lege rijen bevatten

	opdracht.forEach(createOpdrachtInDb);
};

export const insertStudent = (student) => {
	student = student
		.map((student, index) => {
			if (index === 0) return;
			return {
				password: student[0],
				gebruikersnaam: student[1],
				familienaam: student[2],
				voornaam: student[3],
				sorteernaam: student[4],
				email: student[5],
			};
		})
		.filter((s) => s !== undefined) // verwijder header van csv
		.filter((s) => s.password && s.gebruikersnaam && s.familienaam && s.voornaam && s.sorteernaam && s.email); // verwijder studenten die lege rijen bevatten

	student.forEach(createStudentInDb);
};
