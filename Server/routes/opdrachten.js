import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
	res.json(['Tony', 'Lisa', 'Michael', 'Ginger', 'Food']);
});

export default router;
