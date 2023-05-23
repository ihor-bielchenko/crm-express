const serviceUser = require('../services/user.js');

/**
 * 
 */
const validateUserPersonalData = (req, res, next) => {
	let errorMessage = '';

	// if (!req.body['affId']) {
	// 	errorMessage += 'Affiliate ID is required.';
	// }
	if (!req.body['name']
		|| typeof req.body['name'] !== 'string'
		|| (req.body['name'].split(' ')).length < 2) {
		errorMessage += (errorMessage ? '; ' : '') +'The username is in the wrong format (you must enter the first and last name separated by a space).';
	}
	if (!req.body['company']) {
		errorMessage += (errorMessage ? '; ' : '') +'Company name required.';
	}
	if (!req.body['email']
		|| !serviceUser.validateEmail(req.body['email'])) {
		errorMessage += (errorMessage ? '; ' : '') +'Email is in invalid format.';
	}
	if (!req.body['phone']) {
		errorMessage += (errorMessage ? '; ' : '') +'Phone number is required.';
	}

	if (errorMessage) {
		return res
			.status(403)
			.json({
				message: errorMessage,
			});
	}
	return next();
};

module.exports = validateUserPersonalData;
