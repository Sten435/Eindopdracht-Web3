import * as dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import auth from './middleware/auth.js';

import homeRoute from './routes/index.js';
import loginRoute from './routes/login.js';
import logoutRoute from './routes/logout.js';
import studentRoute from './routes/student.js';

const app = express();

app.use(helmet()); // secure apps by setting various HTTP headers
app.use(cors()); // enable cors
app.options('*', cors()); // cors setup
app.use(json({ limit: '200kb' })); // json limit
app.use(cookieParser()); // json limit
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(auth);

app.use('/', homeRoute);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/students', studentRoute);

const port = process.env.PORT || 5000;
console.clear();
app.listen(port, () => console.log(`http://localhost:${port}`));
