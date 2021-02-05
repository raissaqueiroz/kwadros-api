const axios = require('axios');

require('dotenv').config();

const Pagarme = axios.create({
	baseURL: process.env.PAGARME_BASE_URL,
});

module.exports = Pagarme;
