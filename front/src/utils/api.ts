import ky from 'ky';

const url: string = '/api/';

const base = ky.create({ prefixUrl: url });

const token = localStorage.getItem('token');

let api = token ? base.extend({ headers: { Authorization: `Bearer ${token}` } }) : base;

const setApiToken = (token: string | null) => {
  api = token ? base.extend({ headers: { Authorization: `Bearer ${token}` } }) : base;
};

export { api, setApiToken };
