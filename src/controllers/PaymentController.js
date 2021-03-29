const PagHiper = require('../services/PagHiper');
const Pagarme = require('../services/Pagarme');

require('dotenv').config();

class PaymentController {
	// BOLETO -> Integração com a PagHiper
	async ticket(req, res) {
		try {
			const response = await PagHiper.post('/transaction/create', {
				order_id: Math.floor(Math.random() * 100000000).toString(),
				items: [
					{
						description: req.body.kit_name,
						quantity: req.body.kit_quantity,
						price_cents: String(
							parseInt(req.body.kit_price, 10) * 100
						),
						item_id: req.body.kit_id,
					},
					{
						description: `Unidade ${req.body.kit_name}`,
						quantity: req.body.quantity,
						price_cents: String(parseInt(req.body.price, 10) * 100),
						item_id: req.body.id,
					},
				],
				payer_name: req.body.name,
				payer_cpf_cnpj: req.body.cpf,
				payer_email: req.body.email,
				payer_phone: req.body.phone,
				payer_street: req.body.address.street,
				payer_number: req.body.address.number,
				payer_complement: req.body.address.complement,
				payer_district: req.body.address.neighborhood,
				payer_city: req.body.address.city,
				payer_state: req.body.address.uf,
				payer_zip_code: req.body.address.zipecode,
				notification_url: 'https://api.kwadros.com/ipn/ticket',
				per_day_interest: false,
				days_due_date: process.env.PAGHIPER_DAYS_DUE_DATE,
				apiKey: process.env.PAGHIPER_API_KEY,
				type_bank_slip: process.env.PAGHIPER_TYPE_BANK_SLIP,
			});

			return res.json(response.data.create_request);
		} catch (err) {
			return res.json({ error: err.message });
		}
	}

	// CARTÃO DE CRÉDITO -> Integração com Pagarme
	async card(req, res) {
		const { address, customer, card_hash, items, amount } = req.body;

		try {
			const response = await Pagarme.post('/transactions', {
				amount: parseInt(amount * 100, 10),
				card_hash,
				customer: {
					name: customer.name,
					email: customer.email,
					country: 'br',
					external_id: Math.floor(
						Math.random() * 100000000
					).toString(),
					type: 'individual',
					documents: [
						{
							type: 'cpf',
							number: customer.cpf,
						},
					],
					phone_numbers: [customer.phone],
				},
				billing: {
					name: customer.name,
					address: {
						...address,
						country: 'br',
					},
				},
				shipping: {
					name: customer.name,
					fee: 0,
					delivery_date: '2019-07-21',
					expedited: false,
					address: {
						...address,
						country: 'br',
					},
				},
				items: [
					{
						id: items.kit_id,
						title: items.kit_name,
						unit_price: parseInt(items.kit_price * 100, 10),
						quantity: items.kit_quantity,
						tangible: true,
					},
					{
						id: items.product_id,
						title: `Unidade ${items.kit_name}`,
						unit_price: parseInt(items.price * 100, 10),
						quantity: items.quantity,
						tangible: true,
					},
				],
				installments: 1,
				payment_method: 'credit_card',
				postback_url: 'https://api.kwadros/ipn/credit',
				soft_descriptor: 'Kwadros - Kit Muldura',
				api_key: process.env.PAGARME_API_KEY,
			});

			return res.json(response);
		} catch (err) {
			return res.json({ error: err.message });
		}
	}
}

module.exports = new PaymentController();
