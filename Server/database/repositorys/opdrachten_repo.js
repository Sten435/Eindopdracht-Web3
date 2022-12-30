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
		dictionary[item.naam].push({ id: item._id, beschrijving: item.beschrijving, seconden: item.seconden });
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

export const getVragenByStudentAndOpdrachtIdFromDB = async (studentId, opdrachtId) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('vragen');

	const data = await opdrachten.find({ $and: [{ studentId: ObjectId(studentId) }, { opdrachtId: ObjectId(opdrachtId) }] }).toArray();

	return data;
};

export const startOpdrachtInDB = async (opdrachtId) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('opdrachten');

	const result = await opdrachten.updateOne({ _id: ObjectId(opdrachtId) }, { $set: { startDatum: new Date().toISOString() } });

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

export const insertVraagInDB = async (studentId, opdrachtId, vraag) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('vragen');

	const vraagObject = {
		studentId: ObjectId(studentId),
		opdrachtId: ObjectId(opdrachtId),
		vraag,
	};

	const data = await opdrachten.insertOne(vraagObject);

	return data;
};
