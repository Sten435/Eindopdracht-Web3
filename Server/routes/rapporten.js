import { Router } from 'express';
import { getOpdrachtById } from '../controllers/opdrachten_controller.js';
import { getStudentById } from '../controllers/user_controller.js';
import { insertRapport, getRapportByStudentIdAndOpdrachtId, wijzigRapport, getRapport, getRapportenByOpdrachtId } from '../controllers/rapport_controller.js';

const router = Router();

router.post('/start', async (req, res) => {
	const { studentId, opdrachtId } = req.body;
	if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });
	if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

	const bestaatStudentId = await getStudentById(studentId);
	if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

	const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
	if (!bestaatOpdrachtId.found) return res.json({ message: 'opdrachtId bestaat niet', error: true, loggedIn: true });

	const bestaatRapport = await getRapportByStudentIdAndOpdrachtId(studentId, opdrachtId);
	if (bestaatRapport.found) return res.json({ message: 'Rapport bestaat al', error: true, loggedIn: true });

	await insertRapport(studentId, opdrachtId);

	return res.json({ message: 'success', error: false, loggedIn: true });
});

router.get('/:opdrachtId', async (req, res) => {
	const { opdrachtId } = req.params;
	if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

	const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
	if (!bestaatOpdrachtId.found) return res.json({ message: 'opdrachtId bestaat niet', error: true, loggedIn: true });

	const result = await getRapportenByOpdrachtId(opdrachtId);

	return res.json({
		message: 'success',
		error: false,
		loggedIn: true,
		opdracht: bestaatOpdrachtId.opdracht,
		rapporten: result.map((rapport) => {
			return {
				student: rapport.student[0],
				status: rapport.status,
				vragen: rapport.vragen.map((v) => v.vraag),
				extraMinuten: rapport.extraMinuten,
				aanmaakDatum: rapport.aanmaakDatum,
			};
		}),
	});
});

router.get('/:studentId/:opdrachtId', async (req, res) => {
	const { studentId, opdrachtId } = req.params;
	if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });
	if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

	const bestaatStudentId = await getStudentById(studentId);
	if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

	const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
	if (!bestaatOpdrachtId.found) return res.json({ message: 'opdrachtId bestaat niet', error: true, loggedIn: true });

	const bestaatRapport = await getRapportByStudentIdAndOpdrachtId(studentId, opdrachtId);
	if (!bestaatRapport.found) return res.json({ message: 'Rapport bestaat niet', error: true, loggedIn: true });

	const { status, verwijderd, extraMinuten, aanmaakDatum } = await getRapport(studentId, opdrachtId);

	return res.json({ message: 'success', error: false, loggedIn: true, rapport: { status, verwijderd, extraMinuten, aanmaakDatum } });
});

const statusen = ['bezig', 'ik doe niet mee', 'ik geef op', 'ik ben klaar'];

router.put('/status', async (req, res) => {
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
	if (!bestaatOpdrachtId.found) return res.json({ message: 'opdrachtId bestaat niet', error: true, loggedIn: true });

	const bestaatRapport = await getRapportByStudentIdAndOpdrachtId(studentId, opdrachtId);
	if (!bestaatRapport.found) return res.json({ message: 'Rapport bestaat niet', error: true, loggedIn: true });

	try {
		await wijzigRapport(studentId, opdrachtId, status, 'status');
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
	}

	return res.json({ message: 'success', error: false, loggedIn: true });
});

const extraTijden = ['1', '5', '10'];

router.put('/tijd', async (req, res) => {
	const { studentId, opdrachtId, extraTijd } = req.body;

	if (!extraTijd) return res.json({ message: 'extraTijd is niet geldig', error: true, loggedIn: true });
	if (!extraTijden.includes(extraTijd.toString())) return res.json({ message: 'extraTijd is niet geldig', error: true, loggedIn: true });

	if (!studentId) return res.json({ message: 'studentId is niet geldig', error: true, loggedIn: true });
	if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

	const bestaatStudentId = await getStudentById(studentId);
	if (!bestaatStudentId.found) return res.json({ message: 'studentId bestaat niet', error: true, loggedIn: true });

	const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
	if (!bestaatOpdrachtId.found) return res.json({ message: 'opdrachtId bestaat niet', error: true, loggedIn: true });

	const bestaatRapport = await getRapportByStudentIdAndOpdrachtId(studentId, opdrachtId);
	if (!bestaatRapport.found) return res.json({ message: 'Rapport bestaat niet', error: true, loggedIn: true });

	try {
		await wijzigRapport(studentId, opdrachtId, extraTijd, 'extraTijd');
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true });
	}

	return res.json({ message: 'success', error: false, loggedIn: true });
});

export default router;
