const Yup = require('yup');

const User = require('../models/User');

require('dotenv').config();

class UserController {
	async index(req, res) {
		try {
			const response = await User.find({ ...req.query });

			return res.json(response);
		} catch (err) {
			return res.status(400).json({ error: err.message });
		}
	}

	async show(req, res) {
		const { user_id } = req.params;

		const schema = Yup.object().shape({
			user_id: Yup.string().required(),
		});

		if (!(await schema.isValid({ user_id })))
			return res.status(400).json({
				error:
					'Falha na validação. O corpo da requisição não está correto.',
			});

		try {
			const response = await User.findOne({
				_id: user_id,
				...req.query,
			});

			return res.json(response);
		} catch (err) {
			return res.status(400).json({ error: err.message });
		}
	}

	async store(req, res) {
		const schema = Yup.object().shape({
			email: Yup.string().email().required(),
		});

		if (!(await schema.isValid(req.body)))
			return res.status(400).json({
				error:
					'Falha na validação. O corpo da requisição não está correto.',
			});

		try {
			const userExists = await User.findOne({ email: req.body.email });

			if (userExists)
				return res
					.status(400)
					.json({ error: 'Esse usuário já existe.' });

			const new_password = Math.floor(
				Math.random() * 10000000000000000
			).toString();

			const response = await User.create({
				...req.body,
				password_hash: new_password,
			});

			// Envia email com senha gerada + Retorna json cadastrado com senha nova.

			return res.json(response);
		} catch (err) {
			return res.json({ error: err.message });
		}
	}

	async destroy(req, res) {
		const { id } = req.params;

		try {
			const response = await User.findById(id);

			if (!response)
				return res.json({
					error:
						'o ID informado não foi localizado em nossa base de dados.',
				});

			await response.remove();

			return res.send();
		} catch (err) {
			return res.status(400).json({ error: err.message });
		}
	}
}

module.exports = new UserController();
