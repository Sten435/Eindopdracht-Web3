import { Router } from 'express';
import { createToken } from '../controllers/token_controller.js';
const router = Router();

router.post('/', (req, res) => {
	const { username, code } = req.body;
	if (!username || !code) return res.json({ message: 'username en code moeten ingevult zijn', error: true, loggedIn: false });

	const token = createToken(username, code);

	res.cookie('token', token, { secure: false, httpOnly: true, maxAge: 8 * 60 * 60 * 1000, sameSite: 'Lax' });
	res.json({ message: 'succesfully logged in', error: false, loggedIn: true });
});

export default router;
