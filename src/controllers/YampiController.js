const Yampi = require('../services/Yampi');

require('dotenv').config();

class YampiController {
	// Lista os Produtos
	async index(req, res) {
		try {
			const kits = await Yampi.get('/catalog/bundles');
			const product = await Yampi.get(`/catalog/products?include=skus`);
			const frames = [];

			kits.data.data.map((kit) => {
				product.data.data.map((index) => {
					if (kit.items.data[0].sku_id === index.skus.data[0].id) {
						frames.push({
							id: index.id,
							name: index.name,
							sku: index.sku,
							sku_id: index.skus.data[0].id,
							price_unity: index.skus.data[0].price_sale,
							image: kit.image_url,
							kit_price: kit.items.data[0].price,
							kit_quantity: kit.items.data[0].quantity,
							quantity: 0,
							kit_id: kit.items.data[0].bundle_id,
							kit_name: kit.name,
						});
					}
				});
			});

			return res.json(frames);
		} catch (err) {
			return res.status(400).json({ error: err.message });
		}
	}

	// Cria o pedido
	async store(req, res) {
		try {
			// Criar Cliente Yampi
			const { data } = await Yampi.post('/customers', {
				active: true,
				type: 'f',
				email: req.body.email,
				cpf: req.body.cpf,
				homephone: req.body.phone,
				name: req.body.name,
			});

			const idCustomer = String(data.data.id);

			// Criar Pedido Yampi
			const order = {
				status: req.body.status,
				customer_id: idCustomer,
				number: req.body.order_id,
				value_total: req.body.value_total,
				value_products: parseFloat(req.body.value_total),
				value_shipment: 0,
				value_discount: 0,
				shipment_service: 'CORREIOS - PRAZO DE 2 A 4 SEMANAS',
				days_delivery: req.body.days_delivery,
				address: [
					{
						street: req.body.address.street,
						number: req.body.address.number,
						neighborhood: req.body.address.neighborhood,
						complement: req.body.address.complement,
						receiver: req.body.name,
						zipcode: req.body.address.zipcode,
						city: req.body.address.city,
						uf: req.body.address.uf,
					},
				],
				transactions: [
					{
						customer_id: idCustomer,
						amount: req.body.value_total,
						installments: 1,
						holder_document: req.body.cpf,
						installments: req.body.installments,
						holder_name: req.body.name,
						holder_document: req.body.cpf,
						status: req.body.status,
						payment_id: req.body.method,
						// billet_barcode: req.body.ticket_code,
						authorized_at: '2021-01-26 19:59:32',
					},
				],
			};

			let items;

			if (req.body.quantity > 0) {
				items = [
					{
						product_id: Number(req.body.id),
						sku_id: req.body.sku_id,
						quantity: req.body.kit_quantity,
						price: parseFloat(req.body.kit_price),
						sku: req.body.sku,
						// bundle_id: req.body.kit_id,
						// bundle_name: req.body.kit_name,
						item_sku: req.body.sku,
					},
					{
						product_id: Number(req.body.id),
						sku_id: req.body.sku_id,
						quantity: req.body.quantity,
						price: parseFloat(req.body.price),
						sku: req.body.sku,
					},
				];
			} else {
				items = [
					{
						product_id: Number(req.body.id),
						sku_id: req.body.sku_id,
						quantity: req.body.kit_quantity,
						price: 49.0,
						sku: req.body.sku,
						// bundle_id: req.body.kit_id,
						// bundle_name: req.body.kit_name,
						item_sku: req.body.sku,
					},
				];
			}
			order.items = items;

			await Yampi.post('/orders', order);

			return res.send();
		} catch (err) {
			return res.json({ error: err.message });
		}
	}
}

module.exports = new YampiController();
