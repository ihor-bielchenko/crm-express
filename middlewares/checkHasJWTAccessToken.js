const coreHttpResponseResultTemplate = require('../core/httpResponseResultTemplate.js');

/**
 * @param {string} header
 * @return {string}
 */
const _splitAuthorizationString = (header) => {
	const split = header.split('Bearer ');

	return split[1] ?? header;
};

/**
 * @param {object} req
 * @return {string|undefined}
 */
const _defineAccessToken = (req) => {
	return req.headers['authorization']
		? _splitAuthorizationString(req.headers['authorization'])
		: (req.query['access_token'] ?? req.body['access_token']);
};

/**
 * 
 */
const checkHasJWTAccessToken = (req, res, next) => {
	const result = coreHttpResponseResultTemplate({
		message: 'access_token is empty',
	});
	const accessToken = _defineAccessToken(req);

	if (accessToken) {
		req['accessToken'] = accessToken;

		return next();
	}
	return res
		.status(401)
		.json(result.output());
};

module.exports = checkHasJWTAccessToken;
