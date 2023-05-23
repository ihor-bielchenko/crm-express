const serviceOrder = require('../services/order.js');

/**
 * 
 */
const upsellCreate = async (req, res) => {
	try {
		const data = await serviceOrder.upsell(req.query);

		return res
			.json({
				message: 'Upsell order successfully created.',
				data,
			});
	}
	catch (err) {
		return res
			.status(500)
			.json({
				message: err.message,
			});
	}
	return res
		.status(500)
		.json({
			message: 'Request failed. Unknown error.'
		});
};

module.exports = upsellCreate;
