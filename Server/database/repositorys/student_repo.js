import { MongoClient, ObjectId } from 'mongodb';

export const getEncryptedPasswordFromEmailFromDB = async (email) => {
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

export const getStudentByEmailFromDB = async (email) => {
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

export const voegStudentToeInDB = async (student) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		const database = client.db('web3');
		const students = database.collection('studenten');

		const result = await students.insertOne(student);

		return result;
	} finally {
		await client.close();
	}
};

export const updateStudentInDB = async (studentId, student) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);

	try {
		const database = client.db('web3');
		const students = database.collection('studenten');

		const result = await students.updateOne({ _id: ObjectId(studentId) }, { $set: student });

		return result;
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

export const getGroepenFromDB = async () => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('studenten');

	const data = await opdrachten.distinct('cursusGroep');

	return data;
};

export const verwijderStudentFromDB = async (studentId) => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('studenten');

	const data = await opdrachten.deleteOne({ _id: ObjectId(studentId) });

	return data;
};

export const getStudentenFromDB = async () => {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	const database = client.db('web3');
	const opdrachten = database.collection('studenten');

	const data = await opdrachten.find({}).toArray();

	return data;
};
