const { Router } = require('express');

const PaymentController = require('../controllers/PaymentController');

const Payment = new Router();

Payment.post('/payments/cards', PaymentController.card);
Payment.post('/payments/tickets', PaymentController.ticket);

module.exports = Payment;
