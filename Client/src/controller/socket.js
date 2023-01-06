import io from 'socket.io-client';
import { WEBSOCKET_API_URL } from '../config';

export const socket = new io(WEBSOCKET_API_URL, {
	withCredentials: true,
	secure: true,
});
