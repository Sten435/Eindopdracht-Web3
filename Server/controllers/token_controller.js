import jwt from 'jsonwebtoken';
import { getStudentByEmail } from './studenten_controller.js';

export const createToken = (object) => {
	const token = jwt.sign(
		{
			...object,
		},
		process.env.JWT,
		{ expiresIn: parseInt(process.env.TOKEN_EXPIRES) * 60 * 60 * 1000 },
	);

	return token;
};

export const verifyToken = async (token) => {
	try {
		const decodedObject = jwt.verify(token, process.env.JWT);
		if (decodedObject.exp < Date.now() / 1000) throw new Error('token is expired');
		const bestaatStudent = await getStudentByEmail(decodedObject.email);
		if (!bestaatStudent.found) return new Error('gebruiker is verwijderd');

		return { valid: true, user: decodedObject };
	} catch (error) {
		return { valid: false, error, message: error.message };
	}
};
