import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
	res.cookie('token', '');
	res.json({ error: false, message: 'logged out', loggedIn: false });
});

export default router;
