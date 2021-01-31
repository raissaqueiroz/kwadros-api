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
			if (!(await bcrypt.compare(password, response.password_hash)))
				return res.status(401).json({ error: 'Senha incorreta.' });



			// Dados do Usuário
			const { _id: id, name, email } = response;



			return res.json({
				id,
				name,
				email,
				token: jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
			});
		} catch (err) {
			return res.status(400).json({ error: err.message });
		}
	}

	async profile(req, res) {
		try {
			const { _id: id, name, email, } = await User.findOne({ _id: req.user_id, ...req.query});

			return res.json({id, name, email });

		} catch (err) {
			return res.status(400).json({ error: err.message });
		}
	}

	// ENDPONT DESATUALIZADO
	async update(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string(),
			email: Yup.string().email(),
			password: Yup.string().min(6),
			password_confirm: Yup.string().when('password', (password, field) =>
				password ? field.required().oneOf([Yup.ref('password')]) : field
			),
		});

		if (!(await schema.isValid(req.body)))
			return res.status(400).json({
				error:
					'Falha na validação. O corpo da requisição não está correto.',
			});

		try {

			// Validando se esse e-mail não pertence a outro usuário
			if (req.body.email) {
				const userExists = await User.findOne({
					email: req.body.email,
				});

				if (userExists && String(userExists._id) !== req.user_id)
					return res.status(400).json({
						error: 'Esse e-mail já pertence a outro usuário.',
					});
			}

			if (req.body.password_old){

				const userResponse = User.findById(req.user_id);

				if(!(await bcrypt.compare(password_old, userResponse.password_hash)))
					return res.status(401).json({ error: 'Senha incorreta. ' });
			}

			const body = (req.body.password) ? { ...req.body, password_hash: req.body.password } : req.body;

			const response = await User.findOneAndUpdate(
				{ _id: req.user_id },
				body,
				{ new: true }
			);

			return res.json(response);
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
