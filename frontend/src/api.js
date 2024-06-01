// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://app:3000',
});

export default api;
