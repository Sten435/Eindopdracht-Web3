import { Router } from 'express';
import { getOpdrachten, getOpdrachtById, startOpdracht, stopOpdracht, wijzigExtraTijdVragen, voegExtraTijdToe, getGemiddeldeExtraTijd, getOpdrachtByNaamEnBeschrijving, maakNieuweOpdracht } from '../controllers/opdrachten_controller.js';

const router = Router();

router.get('/', async (req, res) => {
	try {
		let opdrachten = await getOpdrachten();

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

		return res.json({ message: 'success', error: false, loggedIn: true, opdracht: opdracht.opdracht });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true, error: error });
	}
});

router.post('/status', async (req, res) => {
	try {
		const { opdrachtId } = req.body;
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

		return res.json({ message: 'success', error: false, loggedIn: true, status: bestaatOpdrachtId.opdracht.status });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true, error: error });
	}
});

router.post('/wijzigExtraTijdVragen', async (req, res) => {
	try {
		const { opdrachtId } = req.body;
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

		await wijzigExtraTijdVragen(opdrachtId, !bestaatOpdrachtId.opdracht.kanStudentExtraTijdVragen);

		return res.json({ message: 'success', error: false, loggedIn: true });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true, error: error });
	}
});

router.post('/voegExtraTijdToe', async (req, res) => {
	try {
		const { opdrachtId } = req.body;
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

		const result = await voegExtraTijdToe(opdrachtId, bestaatOpdrachtId.opdracht);

		return res.json({ message: 'success', error: false, loggedIn: true, result });
	} catch (error) {
		console.log(error);
		return res.json({ message: error.message, error: true, loggedIn: true, error: error });
	}
});

router.get('/extraTijd/:opdrachtId', async (req, res) => {
	try {
		const { opdrachtId } = req.params;
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

		const seconden = await getGemiddeldeExtraTijd(opdrachtId);

		return res.json({ message: 'success', error: false, loggedIn: true, result: { seconden } });
	} catch (error) {
		return res.json({ message: error.message, error: true, loggedIn: true, error: error });
	}
});

router.post('/maak', async (req, res) => {
	try {
		const { naam, beschrijving, seconden } = req.body;
		if (!naam) return res.json({ message: 'naam is niet geldig', error: true, loggedIn: true });
		if (!beschrijving) return res.json({ message: 'beschrijving is niet geldig', error: true, loggedIn: true });
		if (!seconden || seconden <= 0) return res.json({ message: 'seconden is niet geldig', error: true, loggedIn: true });

		const bestaatOpdrachtNaam = await getOpdrachtByNaamEnBeschrijving(naam, beschrijving);
		if (bestaatOpdrachtNaam.found) return res.json({ message: 'opdracht bestaat al', error: true, loggedIn: true });

		await maakNieuweOpdracht(naam, beschrijving, seconden);

		return res.json({ message: 'success', error: false, loggedIn: true });
	} catch (error) {
		console.log(error);
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

router.post('/start', async (req, res) => {
	try {
		const { opdrachtId } = req.body;
		if (!opdrachtId) return res.json({ message: 'opdrachtId is niet geldig', error: true, loggedIn: true });

		const bestaatOpdrachtId = await getOpdrachtById(opdrachtId);
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });

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
		if (!bestaatOpdrachtId.found) return res.json({ message: 'opdracht bestaat niet', error: true, loggedIn: true });
		if (bestaatOpdrachtId.opdracht.gestoptDoorHost) return res.json({ message: 'opdracht is al gestopt', error: true, loggedIn: true });

		await stopOpdracht(opdrachtId);

		return res.json({ message: 'success', error: false, loggedIn: true });
	} catch (error) {
		console.log(error);
		return res.json({ message: error.message, error: true, loggedIn: true });
	}
});

export default router;
