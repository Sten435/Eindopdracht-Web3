import jwt from 'jsonwebtoken';

export const createToken = (username, code) => {
	const token = jwt.sign(
		{
			username,
			code,
		},
		process.env.JWT,
		{ expiresIn: '1h' }
	);

	return token;
};

export const verifyToken = (token) => {
	try {
		const decodedObject = jwt.verify(token, process.env.JWT);
		if (decodedObject.exp < Date.now() / 1000) return res.json({ error: true, message: 'token date is expired', loggedIn: false });
		return true;
	} catch (error) {
		console.log('token has exired');
		return false;
	}
};
