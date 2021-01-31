const { Router } = require('express');

const { authAll, authAdmin } = require('../middlewares/auth');

const UserController = require('../controllers/UserController');

const User = new Router();

/*	ROTAS DE USUÁRIOS  */
User.post('/users', UserController.store);
User.get('/users', authAll, authAdmin, UserController.index);
User.put('/users/:user_id', authAll, authAdmin, UserController.update);
User.get('/users/:user_id', authAll, authAdmin, UserController.show);

module.exports = User;

// Criar auth pra não permitir criação de nivel administrativo quando n estiver autenticado
