import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import auth from './middleware/auth.js';

import homeRoute from './routes/index.js';
import loginRoute from './routes/login.js';
import logoutRoute from './routes/logout.js';
import opdrachtenRoute from './routes/opdrachten.js';
import studentenRoute from './routes/studenten.js';
import rapportenRoute from './routes/rapporten.js';
import importFileRoute from './routes/csv.js';
import authRoute from './routes/auth.js';

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ['http://localhost:3000', 'http://localhost:5000'],
		credentials: true,
	},
});

app.use(helmet()); // secure apps by setting various HTTP headers
app.use(
	cors({
		credentials: true,
		origin: ['http://localhost:3000', 'http://localhost:5000'],
	}),
);
app.use(cookieParser()); // json limit
app.use(bodyParser.urlencoded({ extended: false, limit: '2MB' }));
app.use(bodyParser.json({ limit: '2MB' }));

app.use(auth);

app.use('/', homeRoute);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/import', importFileRoute);
app.use('/auth', authRoute);
app.use('/opdrachten', opdrachtenRoute);
app.use('/studenten', studentenRoute);
app.use('/rapporten', rapportenRoute);

io.on('connection', (socket) => {
	socket.on('toClient', (data) => {
		const action = data.action;
		delete data.action;
		socket.broadcast.emit(action, data);
	});
});

console.clear();
server.listen(port, () => console.log(`http://localhost:${port}`));
