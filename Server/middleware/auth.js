import jwt from 'jsonwebtoken';

const redirectRoute = '/logout';
const nonAuthRoutes = ['/logout', '/login'];

export default async (req, res, next) => {
	const { token } = req.cookies;

	if (nonAuthRoutes.includes(req.url)) return next();
	if (!token) return res.json({ error: true, message: 'token is required', loggedIn: false });

	try {
		const decodedObject = jwt.verify(token, process.env.JWT);
		if (decodedObject.exp < Date.now() / 1000) return res.json({ error: true, message: 'token date is expired', loggedIn: false });

		req.user = decodedObject;
		return next();
	} catch (error) {
		return res.json({ error: true, message: 'token not valid', loggedIn: false });
	}
};
