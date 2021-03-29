const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Yup = require('yup');

const User = require('../models/User');

const { enviarEmail } = require('../helpers/Mail');

require('dotenv').config();

class SessionController {
	async auth(req, res) {
		const { email, password } = req.body;

		const schema = Yup.object().shape({
			email: Yup.string().email().required(),
			password: Yup.string().required(),
		});

		if (!(await schema.isValid({ email, password })))
			return res.status(400).json({
				error:
					'Falha na validação. O corpo da requisição não está correto.',
			});

		try {
			const response = await User.findOne({ email });

			if (!response)
				return res
					.status(401)
					.json({ error: 'E-mail não encontrado.' });

			if (!(await bcrypt.compare(password, response.password_hash)))
				return res.status(401).json({ error: 'Senha incorreta.' });

			// Dados do Usuário
			const { _id: id } = response;

			return res.json({
				id,
				email,
				token: jwt.sign({ id, email }, process.env.JWT_SECRET, {
					expiresIn: '7d',
				}),
			});
		} catch (err) {
			return res.status(400).json({ error: err.message });
		}
	}

	// Recupera a Senha
	async recovery(req, res) {
		const { email } = req.body;

		const schema = Yup.object().shape({
			email: Yup.string().email().required(),
		});

		if (!(await schema.isValid({ email })))
			return res.status(400).json({
				error:
					'Falha na validação. O corpo da requisição não está correto.',
			});

		try {
			const response = await User.findOne({ email });

			if (!response)
				return res
					.status(400)
					.json({ error: 'Esse E-mail não está cadastrado' });

			const senha_nova = Math.floor(Math.random() * 100000000).toString();

			if (
				await User.findByIdAndUpdate(response._id, {
					password_hash: senha_nova,
				})
			) {
				const mailOptions = {
					from: process.env.EMAIL_USER, // de quem
					to: response.email, // para quem
					subject: 'Sua senha da Fluência chegou!', // assunto
					text: 'Sua conta foi recuperada com sucesso!',
					template: 'recuperacao',
					context: {
						nome: response.nome,
						senha: senha_nova,
						url: `${process.env.ORIGIN_URL}/entrar`,
					},
				};

				await enviarEmail(mailOptions);

				return res.json({
					success:
						'Sua conta foi recuperada com sucesso! Por favor, verifique seu email',
				});
			}

			return res
				.status(400)
				.json({ error: 'Erro ao tentar recuperar conta.' });
		} catch (err) {
			return res.status(400).json({ error: err.message });
		}
	}
}

module.exports = new SessionController();
