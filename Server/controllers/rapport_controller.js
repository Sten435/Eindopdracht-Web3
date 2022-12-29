import { insertRapportInDB, getRapportByStudentIdAndOpdrachtIdInDB, wijzigRapportInDB, getRapportFromDb, getRapportenByOpdrachtIdFromDb } from '../database/repositorys/rapport_repo.js';

export const insertRapport = async (studentId, opdrachtId) => {
	return await insertRapportInDB(studentId, opdrachtId);
};

export const getRapport = async (studentId, opdrachtId) => {
	return await getRapportFromDb(studentId, opdrachtId);
};

export const getRapportenByOpdrachtId = async (opdrachtId) => {
	return await getRapportenByOpdrachtIdFromDb(opdrachtId);
};

export const getRapportByStudentIdAndOpdrachtId = async (studentId, opdrachtId) => {
	const result = await getRapportByStudentIdAndOpdrachtIdInDB(studentId, opdrachtId);
	if (!result) return { found: false };
	if (result.length === 0) return { found: false };
	return { found: true, rapport: result[0] };
};

export const wijzigRapport = async (studentId, opdrachtId, actie, actieNaam) => {
	const { rapport } = await getRapportByStudentIdAndOpdrachtId(studentId, opdrachtId);

	if (actieNaam === 'extraTijd' && rapport.extraMinuten === actie) throw new Error('extraTijd is al gelijk aan de actie');
	if (actieNaam === 'status' && rapport.status === actie) throw new Error('status is al gelijk aan de actie');

	return await wijzigRapportInDB(studentId, opdrachtId, actie, actieNaam);
};
