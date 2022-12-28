import { MongoClient } from 'mongodb';

export const insertOpdrachtInDb = async (opdrachten) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		const database = client.db('web3');
		const students = database.collection('opdrachten');

		// this option prevents additional documents from being inserted if one fails
		const options = { ordered: true };

		const result = await students.insertMany(opdrachten, options);
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

	// this option prevents additional documents from being inserted if one fails
	const options = { ordered: false };

	const result = await students.insertMany(studenten, options);
	console.log(`${result.insertedCount} documents were inserted`);
	await client.close();
};
