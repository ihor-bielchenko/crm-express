const coreHttpResponseResultTemplate = require('../core/httpResponseResultTemplate.js');

/**
 * 
 */
const checkHasPassword = (req, res, next) => {
	if (req.body['password']
		|| req.query['password']) {
		return next();
	}
	const result = coreHttpResponseResultTemplate({
		message: 'password not specified',
	});

	return res
		.status(403)
		.json(result.output());
};

module.exports = checkHasPassword;
