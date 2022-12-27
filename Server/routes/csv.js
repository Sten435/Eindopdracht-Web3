import { Router } from 'express';
import { insertOpdracht, insertStudent } from '../controllers/csv_controller.js';
const router = Router();

router.post('/csv/opdracht', (req, res) => {
	const { file } = req.body;
	if (!file) res.json({ error: true, message: 'file not found', loggedIn: true });

	insertOpdracht(file);

	res.json({ error: false, message: 'import success', loggedIn: true });
});

router.post('/csv/student', (req, res) => {
	const { file } = req.body;
	if (!file) res.json({ error: true, message: 'file not found', loggedIn: true });

	insertStudent(file);

	res.json({ error: false, message: 'import success', loggedIn: true });
});

export default router;
