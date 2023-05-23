const serviceUser = require('../services/user.js');

/**
 * 
 */
const verify = async (req, res) => {
	try {
		const {
			email,
			key,
			passwordConfirm,
		} = req.body;
		const data = await serviceUser.reset({
			email,
			key,
			password: passwordConfirm,
		});

		return res
			.json({
				message: 'Password updated successfully.',
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
