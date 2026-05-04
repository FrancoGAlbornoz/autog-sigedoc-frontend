import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // El puerto de tu back
});

export default api;