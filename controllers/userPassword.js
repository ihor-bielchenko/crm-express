const serviceUser = require('../services/user.js');

/**
 * 
 */
const userPassword = async (req, res) => {
	try {
		const {
			passwordOld,
			passwordNew1,
		} = req.body;
		const { id } = req.authUser || {};

		const data = await serviceUser.password(id, {
			passwordOld,
			passwordNew: passwordNew1,
		});

		return res
			.json({
				message: 'Password changed successfully.',
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

module.exports = userPassword;
