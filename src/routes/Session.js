const { Router } = require('express');

const { authAll } = require('../middlewares/auth');

const SessionController = require('../controllers/SessionController');

const Session = new Router();

/*	ROTAS DE CONTAS/AUTENTICAÇÃO  */
Session.post('/sessions', SessionController.auth);
Session.patch('/sessions', SessionController.recovery);
Session.get('/sessions', authAll, SessionController.profile);
Session.put('/sessions', authAll, SessionController.update);


module.exports = Session;

// Auhtorized: Geral + Aberto
// Quando ele for alterar os dados n pode alterar o nivel se n possuir privilégio administrativo
