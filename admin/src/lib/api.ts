import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://qcn88tn1-5000.inc1.devtunnels.ms/api',
  withCredentials: true,
});
