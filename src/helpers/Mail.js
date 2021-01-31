const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

require('dotenv').config();

module.exports = {
	async enviarEmail(mailOptions) {
		const transporter = nodemailer.createTransport({
			service: 'Sendgrid',
			host: 'smtp.sendgrid.net',
			port: 465,
			secure: false,
			requireTLS: true,
			auth: {
				user: 'apikey',
				pass: process.env.SENDGRID_API_KEY,
			},
		});

		// Configurando Template
		transporter.use(
			'compile',
			hbs({
				viewEngine: {
					extName: '.handlebars',
					partialsDir: 'src/app/views/',
					layoutsDir: 'src/app/views/',
					defaultLayout: undefined,
					helpers: undefined,
					compilerOptions: undefined,
				},
				viewPath: 'src/app/views/',
			})
		);

		await transporter.sendMail(mailOptions);
	},


};
