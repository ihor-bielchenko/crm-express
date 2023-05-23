const serviceUser = require('../services/user.js');

/**
 *
 */
const register = async (req, res) => {
	try {
		const {
			name,
			company,
			phone,
			email,
			country,
			region,
			city,
			index,
			address1,
			address2,
			messenger,
			nickname,
			facebook,
			linkedin,
			password,
			referralKey,
		} = req.body;
		const data = await serviceUser.register({
			name,
			company,
			phone,
			email,
			country,
			region,
			city,
			index,
			address1,
			address2,
			messenger,
			nickname,
			facebook,
			linkedin,
			password,
			referralKey,
		});

		return res
			.json({
				message: 'New user successfully registered',
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

module.exports = register;
