import mysql from 'mysql2';

const sqlQuery = async (query, params) =>
	await new Promise(async (resolve, reject) => {
		const pool = mysql.createPool({
			host: process.env.hostDb,
			user: process.env.userDb,
			password: process.env.passwordDb,
			database: process.env.databaseDb,
		});

		try {
			const promisePool = pool.promise();
			const [rows] = await promisePool.execute(query, params);
			return resolve(rows);
		} catch (error) {
			console.log(error?.sqlMessage);
			return reject(error);
		}
	});

export default sqlQuery;
