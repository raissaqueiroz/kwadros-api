const Yampi = require('../services/Yampi');

require('dotenv').config();

class YampiController {

	// Lista os Produtos
	async index(req, res){
		try {
			const kits = await Yampi.get('/catalog/bundles');
			const product = await Yampi.get(`/catalog/products?include=skus`);
			let frames = [];

			kits.data.data.map(kit => {
				product.data.data.map(index => {
					if(kit.items.data[0].sku_id === index.skus.data[0].id){
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
							kit_name:  kit.name

						});
					}

				});
			})

			return res.json(frames);
		} catch(err){
			return res.status(400).json({error: err.message})
		}
	}

	// Cria o pedido
	async store(req, res){



		// // Criar a order
		// const data = {
		// 	status: '',
		// 	customer_id: ,
		// 	number: ,
		// 	value_total:
		// 	value_products:
		// 	value_shipment:
		// 	value_discount:
		// 	shipment_service: '',
		// 	days_delivery:
		// 	items: [
		// 		{
		// 			product_id:
		// 			sku_id:
		// 			quantity:
		// 			price:
		// 			sku: ,

		// 		}
		// 	],
		// 	address: {
		// 		street: '',
		// 		number: '',
		// 		neighborhood: '',
		// 		complement: ,
		// 		reference
		// 		zipcode
		// 		city:
		// 		uf
		// 	},
		// 	transactions: {
		// 		customer_id:
		// 		amount
		// 		installments:
		// 		holder_document
		// 	}


		// }
		try {


			const schema = Yup.object().shape({
				name: Yup.string().required(),
				email: Yup.string().email().required(),
				cpf: Yup.string().required(),
				phone: Yup.string().required(),
			});

			if (!(await schema.isValid(req.body)))
				return res.status(400).json({
					error:
						'Falha na validação. O corpo da requisição não está correto.',
				});

			// Checkout Pagar-me

			// Criar Cliente Yampi
			const {data} = await Yampi.post('/customers', {
				"active": true,
				"type": "f",
				"email": req.body.email,
				"cpf": req.body.cpf,
				"homephone": req.body.phone,
				"name": req.body.name
			});

			const idCustomer = data.id;
			const status = 'paid'; //status vai vim do pagar-me
			const idOrder =  Math.floor(Math.random() * 100000000);

			// Criar Pedido Yampi
			const order = {
				status: status,
				customer_id: idCustomer,
				number: idOrder,
				value_total: req.body.value_total,
				value_products: req.body.value_total,
				value_shipment: 0,
				value_discount: 0,
				shipment_service: req.body.shipment_service, //pac, sedex, transportadora
				days_delivery: req.body.days_delivery,
				items: req.body.items,
				// items: [
				// 	{
				// 		product_id: req.body.product_id
				// 		sku_id: req.body.sku_id
				// 		quantity: req.body.sku_id
				// 		price: req.body
				// 		sku: req.body,
						// bundle_id
						// bundle_name
						// item_sku
				// 	}
				// ],
				address: {
					street: req.body.street,
					number: req.body.number,
					neighborhood: req.body.neighborhood,
					complement: req.body.complement,
					reference: req.body.reference,
					zipcode: req.body.zipcode,
					city: req.body.city,
					uf: req.body.uf
				},
				transactions: {
					customer_id: idCustomer,
					amount: req.body.value_total,
					installments: req.body.installments, //numero de parcelas
					holder_document: req.body.cpf
				}
			}

			const response = await Yampi.post(orders, order);
			return res.json(data);
			// const response = await Yampi.post('/orders', {

			// })
		} catch(err) {
			return res.json({ error : err})
		}
	}


}

module.exports = new YampiController();
