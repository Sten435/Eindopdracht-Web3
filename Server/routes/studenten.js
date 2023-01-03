import { Router } from 'express';
import { getStudentById } from '../controllers/studenten_controller.js';

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

export default router;
