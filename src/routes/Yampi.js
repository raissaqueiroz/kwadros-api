const { Router } = require('express');

const YampiController = require('../controllers/YampiController');

const Yampi = new Router();

/*	ROTAS DE CONTAS/AUTENTICAÇÃO  */
Yampi.get('/frames', YampiController.index);
Yampi.post('/pay', YampiController.store);



module.exports = Yampi;

// Auhtorized: Geral + Aberto
// Quando ele for alterar os dados n pode alterar o nivel se n possuir privilégio administrativo
