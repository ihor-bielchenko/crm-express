const countries = require('i18n-iso-countries');

/**
 * 
 */
const validateUserCommunicationData = (req, res, next) => {
	let errorMessage = '';

	req.body['messenger'] = Number(req.body['messenger']);

	if (req.body['messenger'] !== 0
		&& req.body['messenger'] !== 1) {
		errorMessage += 'Messenger is incorrect.';
	}
	if (!req.body['nickname']) {
		errorMessage += (errorMessage ? '; ' : '') +'Nickname is required.';
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

module.exports = validateUserCommunicationData;
