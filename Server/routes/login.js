import { Router } from 'express';
import { createToken } from '../controllers/token_controller.js';
import { doesUserExist } from '../controllers/studenten_controller.js';
const router = Router();

router.post('/', async (req, res) => {
	try {
		const { email, code } = req.body;
		if (!email || !code) return res.json({ message: 'email en code moeten ingevult zijn', error: true, loggedIn: false });

		const { isValid, user } = await doesUserExist(email, code);

		if (!isValid) return res.json({ message: 'username of code is incorrect', error: true, loggedIn: false });

		const { _id, gebruikersNaam, familieNaam, voorNaam, sorteerNaam, cursusGroep } = user;

		const token = createToken({ _id, gebruikersNaam, familieNaam, voorNaam, email, sorteerNaam, cursusGroep });

		res.cookie('token', token, { secure: false, httpOnly: true, maxAge: parseInt(process.env.TOKEN_EXPIRES) * 60 * 60 * 1000, sameSite: 'Lax' });
		res.json({ message: 'succesfully logged in', error: false, loggedIn: true });
	} catch (error) {
		res.json({ message: error.message, error: true, loggedIn: false });
	}
});

export default router;
