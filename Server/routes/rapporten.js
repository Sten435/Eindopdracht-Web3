import { Router } from 'express';
import { getOpdrachtById } from '../controllers/opdrachten_controller.js';
import { getStudentById } from '../controllers/studenten_controller.js';
import { insertRapport, getRapportByStudentIdAndOpdrachtId, wijzigRapport, getRapport, getRapportenByOpdrachtId, insertVraag, getVragenByStudentAndOpdrachtId, deleteRapport } from '../controllers/rapport_controller.js';

const router = Router();

router.post('/start', async (req, res) => {
	try {
		const { studentId, opdrachtId } = req.body;
		if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatStudentId = await getStudentById(studentId);
		if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

		const bestaatRapport = await getRapportByStudentIdAndOpdrachtId(studentId, opdrachtId);
		if (bestaatRapport.found) return res.json({ message: 'Rapport bestaat al', error: true, loggedIn: true });

		await insertRapport(studentId, opdrachtId);

		return res.json({ message: 'success', error: false, loggedIn: true });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
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
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

		await insertVraag(studentId, opdrachtId, vraag);

		return res.json({ message: 'success', error: false, loggedIn: true });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

router.get('/:opdrachtId', async (req, res) => {
	try {
		const { opdrachtId } = req.params;
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

		const result = await getRapportenByOpdrachtId(opdrachtId);

		return res.json({
			message: 'success',
			error: false,
			loggedIn: true,
			opdracht: bestaatOpdrachtId.opdracht,
			rapporten: result.map((rapport) => {
				return {
					student: rapport.student[0],
					vragen: rapport.vragen.map((v) => v.vraag),
					extraTijd: rapport.extraTijd,
					aanmaakDatum: rapport.aanmaakDatum,
					status: rapport.status,
				};
			}),
		});
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
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

		const vragen = await getVragenByStudentAndOpdrachtId(studentId, opdrachtId);

		return res.json({ message: 'success', error: false, loggedIn: true, vragen: vragen.map((v) => v.vraag) });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

router.get('/:studentId/:opdrachtId', async (req, res) => {
	try {
		const { studentId, opdrachtId } = req.params;
		if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatStudentId = await getStudentById(studentId);
		if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

		const bestaatRapport = await getRapportByStudentIdAndOpdrachtId(studentId, opdrachtId);
		if (!bestaatRapport.found) return res.json({ message: 'Rapport bestaat niet', error: true, loggedIn: true });

		const { status, verwijderd, extraTijd, aanmaakDatum } = await getRapport(studentId, opdrachtId);

		return res.json({ message: 'success', error: false, loggedIn: true, rapport: { status, verwijderd, extraTijd, aanmaakDatum } });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

router.delete('/:opdrachtId/:studentId', async (req, res) => {
	try {
		const { studentId, opdrachtId } = req.params;
		if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatStudentId = await getStudentById(studentId);
		if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

		await deleteRapport(studentId, opdrachtId);

		return res.json({ message: 'success', error: false, loggedIn: true });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

const statusen = ['bezig', 'ik doe niet mee', 'ik geef op', 'ik ben klaar'];

router.put('/status', async (req, res) => {
	try {
		const { studentId, opdrachtId } = req.body;
		let { status } = req.body;

		if (!status) return res.json({ message: 'status is niet geldig', error: true, loggedIn: true });
		else status = status.toLowerCase();
		if (!statusen.includes(status)) return res.json({ message: 'status is niet geldig', error: true, loggedIn: true });

		if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatStudentId = await getStudentById(studentId);
		if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

		const bestaatRapport = await getRapportByStudentIdAndOpdrachtId(studentId, opdrachtId);
		if (!bestaatRapport.found) return res.json({ message: 'Rapport bestaat niet', error: true, loggedIn: true });

		try {
			await wijzigRapport(studentId, opdrachtId, status, 'status');
		} catch (error) {
			return res.json({ message: error.message, error: true, loggedIn: true });
		}

		return res.json({ message: 'success', error: false, loggedIn: true });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

const extraTijden = ['1', '5', '10'];

router.put('/tijd', async (req, res) => {
	try {
		const { studentId, opdrachtId, extraTijd } = req.body;

		if (!extraTijd) return res.json({ message: 'extraTijd is niet geldig', error: true, loggedIn: true });
		if (!extraTijden.includes(extraTijd.toString())) return res.json({ message: 'extraTijd is niet geldig', error: true, loggedIn: true });

		if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatStudentId = await getStudentById(studentId);
		if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

		const bestaatRapport = await getRapportByStudentIdAndOpdrachtId(studentId, opdrachtId);
		if (!bestaatRapport.found) return res.json({ message: 'Rapport bestaat niet', error: true, loggedIn: true });

		if (!bestaatOpdrachtId.opdracht.kanStudentExtraTijdVragen) return res.json({ message: 'Student kan geen extra tijd vragen', error: true, loggedIn: true });

		await wijzigRapport(studentId, opdrachtId, extraTijd, 'extraTijd');
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
	}

	return res.json({ message: 'success', error: false, loggedIn: true });
});

export default router;
