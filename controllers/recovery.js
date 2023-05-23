const serviceUser = require('../services/user.js');

/**
 * 
 */
const recovery = async (req, res) => {
	try {
		const { email } = req.query;
		const data = await serviceUser.recovery({ email });

		return res
			.json({
				message: 'Password reset request sent successfully',
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

module.exports = recovery;
