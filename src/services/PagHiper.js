const axios = require('axios');

require('dotenv').config();

const PagHiper = axios.create({
	baseURL: process.env.PAGHIPER_BASE_URL,
});

module.exports = PagHiper;
