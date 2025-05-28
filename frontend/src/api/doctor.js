
import axios from 'axios';

const API = 'http://localhost:3003/doctors';

export const getAllDoctors = (token) => axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
export const createDoctor = (data, token) => axios.post(API, data, { headers: { Authorization: `Bearer ${token}` } });
