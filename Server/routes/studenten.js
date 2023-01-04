import { Router } from 'express';
import { getStudentById, getStudentByEmail, voegStudentToe, getStudenten, getGroepen, verwijderStudent } from '../controllers/studenten_controller.js';

const router = Router();

router.get('/:studentId', async (req, res) => {
	try {
		const { studentId } = req.params;
		if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });

		const bestaatStudentId = await getStudentById(studentId);
		if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

		return res.json({ message: 'success', error: false, loggedIn: true, student: bestaatStudentId.user });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

router.get('/', async (req, res) => {
	try {
		const studenten = await getStudenten();
		const groepen = await getGroepen();

		studenten.map((student) => delete student.password);

		return res.json({ message: 'success', error: false, loggedIn: true, studenten, groepen });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

router.post('/maak', async (req, res) => {
	try {
		const { voorNaam, achternaam, gebruikersnaam, email, wachtwoord, groep = null } = req.body;

		if (!voorNaam || !achternaam || !gebruikersnaam || !email || !wachtwoord) return res.json({ message: 'niet alle velden zijn ingevuld', error: true, loggedIn: true });

		const bestaatStudentId = await getStudentByEmail(email);
		if (bestaatStudentId.found) return res.json({ message: 'email bestaat al', error: true, loggedIn: true });

		await voegStudentToe({ voorNaam, achternaam, gebruikersnaam, email, wachtwoord, groep });

		return res.json({ message: 'success', error: false, loggedIn: true });
	} catch (error) {
		console.log(error);
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

router.post('/verwijder/:studentId', async (req, res) => {
	try {
		const { studentId } = req.params;

		if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });

		const bestaatStudentId = await getStudentById(studentId);
		if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

		await verwijderStudent(studentId);

		return res.json({ message: 'success', error: false, loggedIn: true });
	} catch (error) {
		console.log(error);
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

export default router;
