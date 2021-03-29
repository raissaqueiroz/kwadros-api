const { Router } = require('express');

const SessionController = require('../controllers/SessionController');

const Session = new Router();

/*	ROTAS DE CONTAS/AUTENTICAÇÃO  */
Session.post('/sessions', SessionController.auth);
Session.patch('/sessions', SessionController.recovery);

module.exports = Session;
