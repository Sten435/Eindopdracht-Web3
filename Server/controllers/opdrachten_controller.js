import { getOpdrachtenFromDB, getOpdrachtByIdFromDB, startOpdrachtInDB, stopOpdrachtInDB, wijzigExtraTijdVragenInDB, voegExtraTijdToeInDB } from '../database/repositorys/opdrachten_repo.js';
import { getRapportenByOpdrachtId } from '../controllers/rapport_controller.js';

export const getOpdrachten = async () => {
	const result = await getOpdrachtenFromDB();

	for (const key in result) {
		result[key] = result[key].map((opdracht) => {
			let timeLeft = opdracht.seconden;
			if (opdracht.startDatum) {
				const startDate = new Date(opdracht.startDatum);
				const newDate = new Date(startDate);
				newDate.setSeconds(startDate.getSeconds() + opdracht.seconden);

				timeLeft = Math.floor((newDate.getTime() - new Date().getTime()) / 1000);
			}

			let status = 'Niet Gestart';
			if (opdracht.startDatum && timeLeft >= 0) {
				status = 'Lopend';
			}

			if (timeLeft < 0) {
				status = 'Afgelopen';
			}

			if (opdracht.gestoptDoorHost) {
				status = 'Beeindigd';
			}

			return {
				...opdracht,
				seconden: timeLeft >= 0 ? timeLeft : null,
				status,
			};
		});
	}

	return result;
};

export const getOpdrachtById = async (opdrachtId) => {
	let result;
	try {
		result = await getOpdrachtByIdFromDB(opdrachtId);
	} catch (error) {
		return { found: false };
	}

	if (!result) return { found: false };
	if (result.length === 0) return { found: false };

	let timeLeft = result[0].seconden;
	if (result[0].startDatum) {
		const startDate = new Date(result[0].startDatum);
		const newDate = new Date(startDate);
		newDate.setSeconds(startDate.getSeconds() + result[0].seconden);

		timeLeft = Math.floor((newDate.getTime() - new Date().getTime()) / 1000);
	}

	let status = 'Niet Gestart';
	if (result[0].startDatum && timeLeft >= 0) {
		status = 'Lopend';
	}

	if (timeLeft < 0) {
		status = 'Afgelopen';
	}

	if (result[0].gestoptDoorHost) {
		status = 'Beeindigd';
	}

	let opdracht = {
		...result[0],
		seconden: timeLeft >= 0 ? timeLeft : null,
		status,
	};

	return { found: true, opdracht: opdracht };
};

export const getGemiddeldeExtraTijdInMinuten = async (opdrachtId) => {
	const rapporten = await getRapportenByOpdrachtId(opdrachtId);

	const rapportenMetExtraMinuten = rapporten.filter((rapport) => rapport.extraMinuten);
	if (rapportenMetExtraMinuten.length === 0) return 0;

	const extraMinuten = rapportenMetExtraMinuten.reduce((acc, rapport) => acc + rapport.extraMinuten, 0) / rapportenMetExtraMinuten.length;

	return extraMinuten;
};

export const startOpdracht = async (opdrachtId) => {
	return await startOpdrachtInDB(opdrachtId);
};

export const wijzigExtraTijdVragen = async (opdrachtId, newValueExtraTijd) => {
	return await wijzigExtraTijdVragenInDB(opdrachtId, newValueExtraTijd);
};

export const voegExtraTijdToe = async (opdrachtId) => {
	const gemiddeldeExtraMinuten = await getGemiddeldeExtraTijdInMinuten(opdrachtId);

	console.log(gemiddeldeExtraMinuten);

	await voegExtraTijdToeInDB(opdrachtId, gemiddeldeExtraMinuten);

	return gemiddeldeExtraMinuten;
};

export const stopOpdracht = async (opdrachtId) => {
	return await stopOpdrachtInDB(opdrachtId);
};
