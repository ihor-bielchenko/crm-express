const serviceUser = require('../services/user.js');
const { AUTH_STATUS } = require('../consts');

/**
 *
 */
const login = async (req, res) => {
	try {

		if(!AUTH_STATUS){
			return res
				.status(500)
				.json({
					message: 'Authorization is not available at the moment',
				});
		}

		const {
			login,
			password,
		} = req.query;

		const data = await serviceUser.login({
			login,
			password,
		});

		return res
			.json({
				message: 'successfully found user '+ (req.query['login'] ?? req.query['login']),
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

module.exports = login;
