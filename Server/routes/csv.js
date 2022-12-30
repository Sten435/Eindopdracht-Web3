import { Router } from 'express';
import { insertOpdracht, insertStudent } from '../controllers/csv_controller.js';
const router = Router();

router.post('/csv/opdracht', async (req, res) => {
	try {
		const { file } = req.body;
		if (!file) res.json({ error: true, message: 'file not found', loggedIn: true });

		await insertOpdracht(file);

		res.json({ error: false, message: 'import success', loggedIn: true });
	} catch (error) {
		res.json({ error: true, message: error.message, loggedIn: true });
	}
});

router.post('/csv/student', async (req, res) => {
	try {
		const { file } = req.body;
		if (!file) res.json({ error: true, message: 'file not found', loggedIn: true });

		await insertStudent(file);

		res.json({ error: false, message: 'import success', loggedIn: true });
	} catch (error) {
		res.json({ error: true, message: error.message, loggedIn: true });
	}
});

export default router;
