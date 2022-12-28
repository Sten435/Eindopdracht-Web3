import { MongoClient, ObjectId } from 'mongodb';

export const insertRapportInDB = async (studentId, opdrachtId) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		const rapport = { studentId: ObjectId(studentId), opdrachtId: ObjectId(opdrachtId), status: 'Bezig', extraMinuten: '', verwijderd: false, aanmaakDatum: new Date().toISOString() };

		const database = client.db('web3');
		const rapporten = database.collection('rapporten');

		const result = await rapporten.insertOne(rapport);

		return result.insertedId;
	} finally {
		await client.close();
	}
};

export const wijzigRapportInDB = async (studentId, opdrachtId, actie, actieNaam) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		const database = client.db('web3');
		const rapporten = database.collection('rapporten');

		let result;
		if (actieNaam === 'extraTijd') {
			result = await rapporten.updateOne({ $and: [{ studentId: ObjectId(studentId) }, { opdrachtId: ObjectId(opdrachtId) }] }, { $set: { extraMinuten: actie } });
		} else result = await rapporten.updateOne({ $and: [{ studentId: ObjectId(studentId) }, { opdrachtId: ObjectId(opdrachtId) }] }, { $set: { status: actie } });

		return result.insertedId;
	} finally {
		await client.close();
	}
};

export const getRapportByStudentIdAndOpdrachtIdInDB = async (studentId, opdrachtId) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		const database = client.db('web3');
		const rapporten = database.collection('rapporten');

		const result = await rapporten.find({ $and: [{ studentId: ObjectId(studentId) }, { opdrachtId: ObjectId(opdrachtId) }] }).toArray();

		return result;
	} finally {
		await client.close();
	}
};
