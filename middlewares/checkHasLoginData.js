const serviceUser = require('../services/user.js');

/**
 * 
 */
const checkHasLoginData = (req, res, next) => {
	if (!req.query['login']) {
		return res
			.status(403)
			.json({
				message: 'Phone number or email not specified.',
			});
	}
	if (!serviceUser.validateEmail(req.query['login'])
		&& !serviceUser.validatePhone(req.query['login'])) {
		return res
			.status(403)
			.json({
				message: 'Login value is in invalid format.',
			});
	}
	return next();
};

module.exports = checkHasLoginData;
