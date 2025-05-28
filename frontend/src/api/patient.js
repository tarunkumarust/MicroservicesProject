
import axios from 'axios';

const API = 'http://localhost:3002/patients';

export const getAllPatients = (token) => axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
export const createPatient = (data, token) => axios.post(API, data, { headers: { Authorization: `Bearer ${token}` } });

