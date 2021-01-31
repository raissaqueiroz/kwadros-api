const jwt = require('jsonwebtoken');
const { promisify } = require('util');

require('dotenv').config();

module.exports = {
	async authAll(req, res, next) {
		const authHeader = req.headers.authorization;

		if (!authHeader)
			return res.status(401).json({ error: 'Token não existe.' });

		const [, token] = authHeader.split(' ');

		try {
			const decoded = await promisify(jwt.verify)(
				token,
				process.env.JWT_SECRET
			);

			req.user_id = decoded.id;
			req.user_level_id = decoded.level_id;
			req.user_level_name = decoded.level_name;

			return next();
		} catch (err) {
			return res.status(401).json({ error: 'Token inválido.' });
		}
	},

	async authAdmin(req, res, next) {
		if (
			req.user_level_name !== 'ADMIN' &&
			req.user_level_name !== 'ADMINISTRADOR'
		)
			return res
				.status(401)
				.json({ error: 'Tipo de Permissão Inválida' });

		return next();
	},

	async authCreateOrUpdatePost(req, res, next) {
		/**
		 * SÓ PODE POSTAR OU EDITAR POST QUEM  É ADMIN ou COLUNISTA
		 */
		if (
			req.user_level_name !== 'ADMIN' &&
			req.user_level_name !== 'ADMINISTRADOR' &&
			req.user_level_name !== 'COLUNISTA'
		)
			return res
				.status(401)
				.json({ error: 'Tipo de Permissão Inválida' });

		if (req.body.status && req.user_level_name === 'Colunista')
			return res.status(401).json({ error: 'Não Autorizado.' });

		return next();
	},
};
