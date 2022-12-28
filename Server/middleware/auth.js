import { verifyToken } from '../controllers/token_controller.js';
const nonAuthRoutes = ['/login', '/logout'];

export default async (req, res, next) => {
	const token = req.cookies.token;

	if (nonAuthRoutes.includes(req.url)) return next();
	try {
		if (!token) return res.json({ error: true, message: 'token is required', loggedIn: false });
		const verifyResult = verifyToken(token);
		if (!verifyResult) return res.json({ error: true, message: 'token not valid', loggedIn: false });

		req.user = verifyResult.user;

		return next();
	} catch (error) {
		return res.json({ error: true, message: 'token not valid', loggedIn: false });
	}
};
