import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
	res.send('Server is running on port 5000');
});

export default router;
