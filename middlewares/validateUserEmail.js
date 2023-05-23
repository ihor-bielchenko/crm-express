const serviceUser = require('../services/user.js');

const validateUserEmail = async (req, res, next) => {
	req.query['email'] = req.query['email'] || req.body['email'];

	if (!req.body['email']) {
		return res
			.status(403)
			.json({
				message: 'Email not specified.',
			});
	}
	if (!serviceUser.validateEmail(req.query['email'])) {
		return res
			.status(403)
			.json({
				message: 'Email is in invalid format.',
			});
	}
	return next();
};

module.exports = validateUserEmail;
