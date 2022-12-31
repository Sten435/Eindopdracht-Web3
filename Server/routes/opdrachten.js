import { Router } from 'express';
import { getOpdrachten, getOpdrachtById, startOpdracht, stopOpdracht } from '../controllers/opdrachten_controller.js';

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
