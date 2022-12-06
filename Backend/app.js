import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { check } from 'express-validator';

import homeRoute from './routes/index.js';
import studentRoute from './routes/student_route.js';

const app = express();

app.use(helmet()); // secure apps by setting various HTTP headers
app.use(cors()); // enable cors
app.options('*', cors()); // cors setup
app.use(json({ limit: '200kb' })); // json limit

app.use('/', homeRoute);
app.use('/students', studentRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`http://localhost:${port}`));
