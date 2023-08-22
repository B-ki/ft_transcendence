import ky from 'ky';

const url: string = 'https://random-data-api.com/api/v2/';

const base = ky.create({ prefixUrl: url });

const token = localStorage.getItem('token');

const api = token ? base.extend({ headers: { Authorization: `Bearer ${token}` } }) : base;

export default api;
