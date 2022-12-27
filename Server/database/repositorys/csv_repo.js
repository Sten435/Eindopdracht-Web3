import sqlQuery from '../sqlQuery.js';

export const createOpdrachtInDb = async (opdracht) => {
	const { naam, beschrijving, minuten } = opdracht;
	const { insertId } = await sqlQuery('INSERT INTO opdracht (Naam) VALUES (?)', [naam]);
	return await sqlQuery('INSERT INTO opdrachtelement (OpdrachtID, Beschrijving, Minuten) VALUES (?, ?, ?)', [insertId, beschrijving, minuten]);
};

export const createStudentInDb = async (student) => {
	const { password, gebruikersnaam, familienaam, voornaam, sorteernaam, email } = student;
	await sqlQuery('INSERT INTO student (Password, Gebruikersnaam, Familienaam, Voornaam, Sorteernaam, Email) VALUES (?, ?, ?, ?, ?, ?)', [password, gebruikersnaam, familienaam, voornaam, sorteernaam, email]);
};
