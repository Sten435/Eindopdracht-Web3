import { getVragenByStudentAndOpdrachtIdFromDB, insertVraagInDB, getOpdrachtenFromDB, getOpdrachtByIdFromDB } from '../database/repositorys/opdrachten_repo.js';

export const getOpdrachten = async () => {
	return await getOpdrachtenFromDB();
};

export const getOpdrachtById = async (opdrachtId) => {
	const result = await getOpdrachtByIdFromDB(opdrachtId);
	if (!result) return { found: false };
	if (result.length === 0) return { found: false };
	return { found: true, opdracht: result[0] };
};

export const insertVraag = async (studentId, opdrachtId, vraag) => {
	return await insertVraagInDB(studentId, opdrachtId, vraag);
};

export const getVragenByStudentAndOpdrachtId = async (studentId, opdrachtId) => {
	return await getVragenByStudentAndOpdrachtIdFromDB(studentId, opdrachtId);
};
