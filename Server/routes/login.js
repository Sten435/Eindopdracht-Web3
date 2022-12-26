import jwt from 'jsonwebtoken';
import { Router } from 'express';
const router = Router();

router.post('/', (req, res) => {
	const { username, code } = req.body;
	if (!username || !code) return res.json({ message: 'username en code moeten ingevult zijn', error: true, loggedIn: false });

	const token = jwt.sign(
		{
			username,
			code,
		},
		process.env.JWT,
		{ expiresIn: '1h' }
	);

	res.cookie('token', token);
	res.redirect('/student/dashboard');
});

export default router;
