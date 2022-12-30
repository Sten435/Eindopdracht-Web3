import { Router } from 'express';
import { getOpdrachten, getOpdrachtById, insertVraag, getVragenByStudentAndOpdrachtId, startOpdracht, stopOpdracht } from '../controllers/opdrachten_controller.js';
import { getStudentById } from '../controllers/user_controller.js';

const router = Router();

router.get('/', async (req, res) => {
	try {
		const opdrachten = await getOpdrachten();
		return res.json({ message: 'success', error: false, loggedIn: true, opdrachten });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true, error: error });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) return res.json({ message: 'id is niet geldig', error: true, loggedIn: true });

		const opdracht = await getOpdrachtById(id);
		if (!opdracht.found) return res.json({ message: 'opdracht niet gevonden', error: true, loggedIn: true });

		const { naam, beschrijving, seconden } = opdracht.opdracht;

		return res.json({ message: 'success', error: false, loggedIn: true, opdracht: { naam, beschrijving, seconden } });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true, error: error });
	}
});

router.post('/vraag', async (req, res) => {
	try {
		const { studentId, opdrachtId, vraag } = req.body;
		if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });
		if (!vraag) return res.json({ message: 'vraag is niet geldig', error: true, loggedIn: true });

		const bestaatStudentId = await getStudentById(studentId);
		if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdrachtId bestaat niet', error: true, loggedIn: true });

		await insertVraag(studentId, opdrachtId, vraag);

		return res.json({ message: 'success', error: false, loggedIn: true });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

router.post('/start', async (req, res) => {
	try {
		const { opdrachtId } = req.body;
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdrachtId bestaat niet', error: true, loggedIn: true });

		await startOpdracht(opdrachtId);

		return res.json({ message: 'success', error: false, loggedIn: true });
	} catch (error) {
		console.log(error);
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

router.post('/stop', async (req, res) => {
	try {
		const { opdrachtId } = req.body;
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdrachtId bestaat niet', error: true, loggedIn: true });
		if (bestaatOpdrachtId.opdracht.gestoptDoorHost) return res.json({ message: 'opdracht is al gestopt', error: true, loggedIn: true });

		await stopOpdracht(opdrachtId);

		return res.json({ message: 'success', error: false, loggedIn: true });
	} catch (error) {
		console.log(error);
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

router.get('/vraag/:studentId/:opdrachtId', async (req, res) => {
	try {
		const { studentId, opdrachtId } = req.params;
		if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatStudentId = await getStudentById(studentId);
		if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdrachtId bestaat niet', error: true, loggedIn: true });

		const vragen = await getVragenByStudentAndOpdrachtId(studentId, opdrachtId);

		return res.json({ message: 'success', error: false, loggedIn: true, vragen: vragen.map((v) => v.vraag) });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

export default router;
