import { API_URL } from '../config';
import axios from 'axios';

const Fetch = async (url = '', method = '', body = {}) => {
	if (!url) throw new Error('Error: Invalid url');

	if (url[0].toString() !== '/') {
		url = '/' + url;
	}

	axios.defaults.withCredentials = true;

	if (method === 'GET') {
		return (await axios.get(API_URL + url, { ...body, ...{ withCredentials: true, headers: { 'Content-Type': 'application/json', Accept: 'application/json' } } })).data;
	} else if (method === 'POST') {
		return (await axios.post(API_URL + url, { ...body, ...{ withCredentials: true, headers: { 'Content-Type': 'application/json', Accept: 'application/json' } } })).data;
	} else if (method === 'PUT') {
		return (await axios.put(API_URL + url, { ...body, ...{ withCredentials: true, headers: { 'Content-Type': 'application/json', Accept: 'application/json' } } })).data;
	} else if (method === 'DELETE') {
		return (await axios.delete(API_URL + url, { ...body, ...{ withCredentials: true, headers: { 'Content-Type': 'application/json', Accept: 'application/json' } } })).data;
	} else throw new Error('Error: Invalid method');
};

export default Fetch;
