const serviceUser = require('../services/user.js');

/**
 * 
 */
const refresh = async (req, res) => {
	try {
		const { email } = req.query;
		const data = await serviceUser.refresh({ email });

		return res
			.json({
				message: 'refresh tokens',
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

module.exports = refresh;
