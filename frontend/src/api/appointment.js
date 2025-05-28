
import axios from 'axios';

const API = 'http://localhost:3004/appointments';

export const getAllAppointments = (token) => axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
export const createAppointment = (data, token) => axios.post(API, data, { headers: { Authorization: `Bearer ${token}` } });
