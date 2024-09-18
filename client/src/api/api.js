import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
});

const apiPrivate = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	withCredentials: true,
});

export { api, apiPrivate };
