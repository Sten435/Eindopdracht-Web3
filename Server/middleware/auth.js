import { verifyToken } from '../controllers/token_controller.js';
const nonAuthRoutes = ['/login', '/logout', '/import/csv/student'];

export default async (req, res, next) => {
	const token = req.cookies.token;

	if (nonAuthRoutes.includes(req.url)) return next();
	try {
		if (!token) return res.json({ error: true, message: 'token is required', loggedIn: false });
		const verifyResult = await verifyToken(token);
		if (!verifyResult.valid) throw new Error(verifyResult.message);
		req.user = verifyResult.user;

		return next();
	} catch (error) {
		return res.json({ error: true, message: error.message, loggedIn: false });
	}
};
