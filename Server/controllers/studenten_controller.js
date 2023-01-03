import { getEncryptedPasswordFromEmailFromDb, getStudentFromDb, getStudentByIdFromDB } from '../database/repositorys/user_repo.js';
import bcrypt from 'bcrypt';

export const doesUserExist = async (email, code) => {
	let hashedPassword = await getEncryptedPasswordFromEmailFromDb(email);

	if (!hashedPassword) return false;

	const isValid = await validateCode(code, hashedPassword);

	if (isValid) {
		const user = await getUser(email);
		if (!user.found) return { isValid: false };
		return { isValid: true, user: user.user };
	} else return { isValid: false };
};

export const getUser = async (email) => {
	const user = await getStudentFromDb(email);
	if (!user) return { found: false };
	if (user.length === 0) return { found: false };
	return { found: true, user };
};

export const getStudentById = async (studentId) => {
	let user;
	try {
		user = await getStudentByIdFromDB(studentId);
	} catch (error) {
		return { found: false };
	}

	if (!user) return { found: false };
	if (user.length === 0) return { found: false };
	return { found: true, user: user[0] };
};

export const encryptCode = (code) => {
	const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_COUNT));
	const hash = bcrypt.hashSync(code, salt);

	return hash;
};

export const validateCode = async (code, hash) => {
	return await bcrypt.compare(code, hash);
};
