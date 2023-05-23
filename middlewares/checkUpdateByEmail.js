const serviceUser = require('../services/user.js');


/**
 *
 */
const checkUpdateByEmail = (req, res, next) => {
	if (req.query['email']
		&& serviceUser.validateEmail(req.query['email'])) {
		req.body['byEmail'] = req.query['email'];
	}
	return next();
};

module.exports = checkUpdateByEmail;
