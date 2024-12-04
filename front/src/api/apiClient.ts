import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.0.12:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
