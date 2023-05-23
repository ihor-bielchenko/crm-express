const countries = require('i18n-iso-countries');

/**
 * 
 */
const validateAccountVerifyKey = (req, res, next) => {
	let errorMessage = '';

	if (!req.body['key']) {
		errorMessage += 'Activation key not specified.';
	}
	const payload = JSON.parse(Buffer.from(req.body['key'], 'base64').toString());

	if (!payload.email
		|| !payload.password) {
		errorMessage += (errorMessage ? '; ' : '') +'Wrong key format.';
	}
	req.body['email'] = payload.email;
	req.body['password'] = payload.password;

	if (errorMessage) {
		return res
			.status(403)
			.json({
				message: errorMessage,
			});
	}
	return next();
};

module.exports = validateAccountVerifyKey;
