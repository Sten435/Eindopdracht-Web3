import { MongoClient, ObjectId } from 'mongodb';

export const getEncryptedPasswordFromEmailFromDb = async (email) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		const database = client.db('web3');
		const students = database.collection('studenten');

		const result = await students.find({ email: email }).toArray();
		if (result.length > 0) return result[0].password;
		return null;
	} finally {
		await client.close();
	}
};

export const getStudentFromDb = async (email) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		const database = client.db('web3');
		const students = database.collection('studenten');

		const result = await students.find({ email: email }).toArray();

		if (result.length > 0) return result[0];
		return null;
	} finally {
		await client.close();
	}
};

export const getStudentByIdFromDB = async (studentId) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('studenten');

	const data = await opdrachten.find({ _id: ObjectId(studentId) }).toArray();

	return data;
};
