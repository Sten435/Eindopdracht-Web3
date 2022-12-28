import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => res.json({ error: false, message: 'authenticated', loggedIn: true, user: req.user }));

export default router;
