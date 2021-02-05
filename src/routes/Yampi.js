const { Router } = require('express');

const YampiController = require('../controllers/YampiController');

const Yampi = new Router();

/*	ROTAS DE CONTAS/AUTENTICAÇÃO  */
Yampi.get('/frames', YampiController.index);
Yampi.post('/orders', YampiController.store);

module.exports = Yampi;
