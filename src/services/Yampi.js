const axios = require('axios');

require('dotenv').config();

const Yampi = axios.create({
	baseURL: process.env.YAMPI_BASE_URL
});

Yampi.interceptors.request.use(async config => {

        config.headers['user-token'] = process.env.YAMPI_USER_TOKEN;
        config.headers['user-secret-key'] = process.env.YAMPI_SECRET_KEY;
        config.headers['Content-Type'] = 'application/json'

    return config;
});

module.exports = Yampi;
