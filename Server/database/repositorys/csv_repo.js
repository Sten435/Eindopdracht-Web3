import { MongoClient } from 'mongodb';

export const insertOpdrachtInDb = async (opdrachten) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		const database = client.db('web3');
		const students = database.collection('opdrachten');

		const result = await students.insertMany(opdrachten);
		console.log(`${result.insertedCount} documents were inserted`);
	} finally {
		await client.close();
	}
};

export const insertStudentenInDb = async (studenten) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const students = database.collection('studenten');

	const result = await students.insertMany(studenten);
	console.log(`${result.insertedCount} documents were inserted`);
	await client.close();
};
