const serviceUser = require('../services/user.js');

/**
 * 
 */
const verify = async (req, res) => {
	try {
		const {
			email,
			key,
		} = req.body;
		const data = await serviceUser.verify({
			email,
			key
		});

		return res
			.json({
				message: 'Account has activated successfully.',
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

module.exports = verify;
