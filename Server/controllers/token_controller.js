import jwt from 'jsonwebtoken';

export const createToken = (object) => {
	const token = jwt.sign(
		{
			...object,
		},
		process.env.JWT,
		{ expiresIn: '1h' }
	);

	return token;
};

export const verifyToken = (token) => {
	try {
		const decodedObject = jwt.verify(token, process.env.JWT);
		if (decodedObject.exp < Date.now() / 1000) return res.json({ error: true, message: 'token is expired', loggedIn: false });
		return { valid: true, user: decodedObject };
	} catch (error) {
		return res.json({ error: true, message: 'token is expired', loggedIn: false });
	}
};
