import { getOpdrachtenFromDB, getOpdrachtByIdFromDB, startOpdrachtInDB, stopOpdrachtInDB, wijzigExtraTijdVragenInDB, voegExtraTijdToeInDB, getOpdrachtByNaamEnBeschrijvingFromDB, maakNieuweOpdrachtInDB, verwijderdOpdrachtFromDB } from '../database/repositorys/opdrachten_repo.js';
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

				timeLeft = Math.floor((newDate - Date.now()) / 1000);
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

		timeLeft = Math.round((newDate - Date.now()) / 1000);
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

export const getOpdrachtByNaamEnBeschrijving = async (naam, beschrijving) => {
	let result;
	try {
		result = await getOpdrachtByNaamEnBeschrijvingFromDB(naam, beschrijving);
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

		timeLeft = Math.round((newDate - Date.now()) / 1000);
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

export const maakNieuweOpdracht = async (naam, beschrijving, seconden) => {
	const opdracht = {
		naam: naam,
		beschrijving: beschrijving,
		seconden: seconden,
		startDatum: null,
		kanStudentExtraTijdVragen: true,
		gestoptDoorHost: false,
	};
	return await maakNieuweOpdrachtInDB(opdracht);
};

export const getGemiddeldeExtraTijd = async (opdrachtId) => {
	const rapporten = await getRapportenByOpdrachtId(opdrachtId);

	const rapportenMetextraTijd = rapporten.filter((rapport) => rapport.extraTijd);
	if (rapportenMetextraTijd.length === 0) return 0;

	const extraTijd = rapportenMetextraTijd.reduce((acc, rapport) => acc + rapport.extraTijd, 0) / rapportenMetextraTijd.length;

	return extraTijd;
};

export const startOpdracht = async (opdrachtId) => {
	return await startOpdrachtInDB(opdrachtId);
};

export const verwijderdOpdracht = async (opdrachtId) => {
	return await verwijderdOpdrachtFromDB(opdrachtId);
};

export const wijzigExtraTijdVragen = async (opdrachtId, newValueExtraTijd) => {
	return await wijzigExtraTijdVragenInDB(opdrachtId, newValueExtraTijd);
};

export const voegExtraTijdToe = async (opdrachtId) => {
	const gemiddeldeextraTijd = await getGemiddeldeExtraTijd(opdrachtId);

	await voegExtraTijdToeInDB(opdrachtId, gemiddeldeextraTijd);

	return gemiddeldeextraTijd;
};

export const stopOpdracht = async (opdrachtId) => {
	return await stopOpdrachtInDB(opdrachtId);
};
