
import axios from 'axios';

const API = 'http://localhost:3000/auth/users';

export const getAllUsers = (token) => axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
export const createUsers = (data, token) => axios.post(API, data, { headers: { Authorization: `Bearer ${token}` } });

