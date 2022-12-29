import { Router } from 'express';
import { getOpdrachten, getOpdrachtById, insertVraag, getVragenByStudentAndOpdrachtId } from '../controllers/opdrachten_controller.js';
import { getStudentById } from '../controllers/user_controller.js';

const router = Router();

router.get('/', async (req, res) => {
	const opdrachten = await getOpdrachten();
	return res.json({ message: 'success', error: false, loggedIn: true, opdrachten });
});

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	if (!id) return res.json({ message: 'id is niet geldig', error: true, loggedIn: true });

	const opdracht = await getOpdrachtById(id);
	if (!opdracht.found) return res.json({ message: 'opdracht niet gevonden', error: true, loggedIn: true });

	const { naam, beschrijving, minuten } = opdracht.opdracht;

	return res.json({ message: 'success', error: false, loggedIn: true, opdracht: { naam, beschrijving, minuten } });
});

router.post('/vraag', async (req, res) => {
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
});

router.get('/vraag/:studentId/:opdrachtId', async (req, res) => {
	const { studentId, opdrachtId } = req.params;
	if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });
	if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

	const bestaatStudentId = await getStudentById(studentId);
	if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

	const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
	if (!bestaatOpdrachtId.found) return res.json({ message: 'opdrachtId bestaat niet', error: true, loggedIn: true });

	const vragen = await getVragenByStudentAndOpdrachtId(studentId, opdrachtId);

	return res.json({ message: 'success', error: false, loggedIn: true, vragen: vragen.map((v) => v.vraag) });
});

export default router;
