const countries = require('i18n-iso-countries');

/**
 * 
 */
const validateUserLocationData = (req, res, next) => {
	let errorMessage = '';

	if (!req.body['country']
		|| !countries.isValid(req.body['country'])) {
		errorMessage += 'Country is incorrect.';
	}
	if (!req.body['region']) {
		errorMessage += (errorMessage ? '; ' : '') +'Region is required.';
	}
	if (!req.body['city']) {
		errorMessage += (errorMessage ? '; ' : '') +'City is required.';
	}
	if (!req.body['index']) {
		errorMessage += (errorMessage ? '; ' : '') +'Index is required.';
	}
	if (!(Number(req.body['index']) > 0)) {
		errorMessage += (errorMessage ? '; ' : '') +'Index is incorrect.';
	}
	if (!req.body['address1']
		&& !req.body['address2']) {
		errorMessage += (errorMessage ? '; ' : '') +'Address is required.';
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

module.exports = validateUserLocationData;
