const axios = require('axios');

require('dotenv').config();

const api = axios.create({
	baseURL: process.env.PAGSEGURO_BASE_URL
});

module.exports = api;
