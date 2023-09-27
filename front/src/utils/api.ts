import ky from 'ky';

const url: string = 'http://localhost:8080/api/';

const base = ky.create({ prefixUrl: url });

const token = localStorage.getItem('token');

const api = token ? base.extend({ headers: { Authorization: `Bearer ${token}` } }) : base;

export default api;
