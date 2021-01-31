const Yup = require('yup');

const User = require('../models/User');

require('dotenv').config();

class UserController {
	async index(req, res) {
		try {
			const response = await User.find({ ...req.query }).populate('level_id');

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
			}).populate('level_id');

			return res.json(response);
		} catch (err) {
			return res
				.status(400)
				.json({ error: err.message });
		}
	}

	async store(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string().required(),
			email: Yup.string().email().required(),
			password: Yup.string().min(6),
		});

		if (!(await schema.isValid(req.body)))
			return res.status(400).json({
				error:
					'Falha na validação. O corpo da requisição não está correto.',
			});

		try {
			const userExists = await User.findOne({ email: req.body.email });

			if (userExists)
				return res.status(400).json({ error: 'Esse usuário já existe.' });


			const response = await User.create({
				...req.body,
				password_hash:  Math.floor(Math.random() * 10000000000000000).toString(),
			});

			return res.json(response);
		} catch(err){
			return res.json({ error: err.message })
		}

	}

	async update(req, res) {
		const { user_id } = req.params;

		const schema = Yup.object().shape({
			name: Yup.string(),
			email: Yup.string().email(),
			password: Yup.string().min(6),
			user_id: Yup.string().required(),
		});

		if (!(await schema.isValid({ ...req.body, user_id })))
			return res.status(400).json({
				error:
					'Falha na validação. O corpo da requisição não está correto.',
			});

		try {

			const user = await User.findById(user_id);

			if(!user) return res.status(400).json({ error: 'O ID Informado não Existe. ' });
			// Validando se esse e-mail não pertence a outro usuário
			if (req.body.email && req.body.email !== user.email) {
				const userExists = await User.findOne({
					email: req.body.email,
				});

				if (userExists)
					return res.status(400).json({
						error: 'Esse e-mail já pertence a outro usuário.',
					});
			}

			const body = (req.body.password) ? { ...req.body, password_hash: req.body.password } : req.body;

			const response = await User.findOneAndUpdate(
				{ _id: user_id },
				body,
				{ new: true }
			);

			return res.json(response);
		} catch(err){
			return res.json({ error: err.message })
		}
	}

	async destroy(req, res){
		const { id } = req.params;

		try {
			const response = await User.findById(id);

			if(!response) return res.json({ error: 'o ID informado não foi localizado em nossa base de dados.' });

			await response.remove();

			return res.send();
		} catch (err) {
			return res.status(400).json({ error: err.message });
		}
	}
}

module.exports = new UserController();
