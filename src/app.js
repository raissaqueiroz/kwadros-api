const express = require('express');
const cors = require('cors');
const path = require('path');

// Database
const database = require('./database');
// Routes
const routes = require('./routes');

require('dotenv').config();

class App {
	constructor() {
		this.server = express();

		database.createConnection();

		this.middlewares();
		this.routes();
	}

	middlewares() {
		this.server.use(express.json());
		this.server.use(express.urlencoded({ extended: true, limit: '2gb' }));
		this.server.use(
			'/files',
			express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
		);

		const allowedOrigins = [
			'http://localhost:3000',
			'http://app.kwadros.com',
			'https://app.kwadros.com',
			'https://www.kwadros.com',
			'http://www.kwadros.com',
			'https://kwadros.com',
			'http://kwadros.com',
		];

		this.server.use(
			cors({
				origin: function (origin, callback) {
					// allow requests with no origin
					// (like mobile apps or curl requests)
					if (!origin) return callback(null, true);

					if (allowedOrigins.indexOf(origin) === -1) {
						const msg =
							'The CORS policy for this site does not ' +
							'allow access from the specified Origin.';

						return callback(new Error(msg), false);
					}
					return callback(null, true);
				},
			})
		);
	}

	routes() {
		this.server.use(routes.Session);
		this.server.use(routes.User);
		this.server.use(routes.Payment);
		this.server.use(routes.Upload);
	}
}

module.exports = new App().server;
