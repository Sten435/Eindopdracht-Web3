import { MongoClient, ObjectId } from 'mongodb';

export const getOpdrachtenFromDB = async () => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('opdrachten');

	const data = await opdrachten.find().toArray();

	const dictionary = {};

	data.forEach((item) => {
		if (!dictionary[item.naam]) {
			dictionary[item.naam] = [];
		}
		dictionary[item.naam].push({ id: item._id, beschrijving: item.beschrijving, seconden: item.seconden, naam: item.naam, verwijderd: item.verwijderd, startDatum: item.startDatum, kanStudentExtraTijdVragen: item.kanStudentExtraTijdVragen, gestoptDoorHost: item.gestoptDoorHost });
	});

	return dictionary;
};

export const getOpdrachtByIdFromDB = async (opdrachtId) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('opdrachten');

	const data = await opdrachten.find({ _id: ObjectId(opdrachtId) }).toArray();

	return data;
};

export const getOpdrachtByNaamEnBeschrijvingFromDB = async (naam, beschrijving) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('opdrachten');

	const data = await opdrachten.find({ $and: [{ naam: naam }, { beschrijving: beschrijving }] }).toArray();

	return data;
};

export const maakNieuweOpdrachtInDB = async (opdracht) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		const database = client.db('web3');
		const students = database.collection('opdrachten');

		const result = await students.insertOne(opdracht);
		return result;
	} finally {
		await client.close();
	}
};

export const startOpdrachtInDB = async (opdrachtId) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('opdrachten');

	const result = await opdrachten.updateOne({ _id: ObjectId(opdrachtId) }, { $set: { startDatum: Date.now() } });

	return result;
};

export const wijzigExtraTijdVragenInDB = async (opdrachtId, newValueExtraTijd) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('opdrachten');

	const result = await opdrachten.updateOne({ _id: ObjectId(opdrachtId) }, { $set: { kanStudentExtraTijdVragen: newValueExtraTijd } });

	return result;
};

export const voegExtraTijdToeInDB = async (opdrachtId, gemiddeldeextraTijd) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('opdrachten');

	const opdracht = await opdrachten.findOne({ _id: ObjectId(opdrachtId) });

	const result = await opdrachten.updateOne({ _id: ObjectId(opdrachtId) }, { $set: { seconden: gemiddeldeextraTijd * 60 + opdracht.seconden } });

	return result;
};

export const stopOpdrachtInDB = async (opdrachtId) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('opdrachten');

	const result = await opdrachten.updateOne({ _id: ObjectId(opdrachtId) }, { $set: { gestoptDoorHost: true } });

	return result;
};
