const { AUTH_STATUS } = require('../consts');

/**
 *
 */
const config = async (req, res) => {
	try {
		return res
			.json({
				data: {
					server_status: AUTH_STATUS,
				},
			});
	}
	catch (err) {
		return res
			.status(500)
			.json({
				message: err.message,
			});
	}
};

module.exports = config;
