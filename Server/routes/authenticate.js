import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
	res.json({ error: false, message: 'authenticated', loggedIn: true });
});

export default router;
