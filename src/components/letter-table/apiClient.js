import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://192.168.100.11:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  timeout: 15000
});