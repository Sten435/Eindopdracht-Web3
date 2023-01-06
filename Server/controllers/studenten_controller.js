import { getEncryptedPasswordFromEmailFromDB, getGroepenFromDB, getStudentByEmailFromDB, getStudentByIdFromDB, getStudentenFromDB, updateStudentInDB, verwijderStudentFromDB, voegStudentToeInDB } from '../database/repositorys/student_repo.js';
import bcrypt from 'bcrypt';

export const getStudenten = async () => {
	return await getStudentenFromDB();
};

export const getGroepen = async () => {
	return await getGroepenFromDB();
};

export const verwijderStudent = async (studentId) => {
	return await verwijderStudentFromDB(studentId);
};

export const validateCode = async (code, hash) => {
	return await bcrypt.compare(code, hash);
};

export const updateStudent = async (studentId, student) => {
	return await updateStudentInDB(studentId, student);
};

export const encryptCode = (code) => {
	const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_COUNT));
	const hash = bcrypt.hashSync(code, salt);

	return hash;
};

export const getStudentByEmail = async (email) => {
	const user = await getStudentByEmailFromDB(email);
	if (!user) return { found: false };
	if (user.length === 0) return { found: false };
	return { found: true, user };
};

export const doesUserExist = async (email, code) => {
	let hashedPassword = await getEncryptedPasswordFromEmailFromDB(email);

	if (!hashedPassword) return false;

	const isValid = await validateCode(code, hashedPassword);

	if (isValid) {
		const user = await getStudentByEmail(email);
		if (!user.found) return { isValid: false };
		return { isValid: true, user: user.user };
	} else return { isValid: false };
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

export const voegStudentToe = async (nieuweStudent) => {
	const student = {
		password: encryptCode(nieuweStudent.wachtwoord),
		gebruikersNaam: nieuweStudent.gebruikersnaam,
		familieNaam: nieuweStudent.achternaam,
		voorNaam: nieuweStudent.voorNaam,
		sorteerNaam: nieuweStudent.achternaam.toUpperCase() + ',' + nieuweStudent.voorNaam.toUpperCase(),
		email: nieuweStudent.email,
		cursusGroep: nieuweStudent.groep ?? 'Geen',
	};
	return await voegStudentToeInDB(student);
};
