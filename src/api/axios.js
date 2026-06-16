import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // El puerto de tu back
});

export default api;
