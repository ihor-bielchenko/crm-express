const coreHttpResponseResultTemplate = require('../core/httpResponseResultTemplate.js');

/**
 * @param {object} req
 * @return {string|undefined}
 */
const _defineRefreshToken = (req) => {
	return req.headers['refresh_token'] 
		?? req.query['refresh_token'] 
		?? req.body['refresh_token'];
};

/**
 * 
 */
const checkHasJWTRefreshToken = (req, res, next) => {
	const result = coreHttpResponseResultTemplate({
		message: 'refresh_token is empty',
	});
	const refreshToken = _defineRefreshToken(req);

	if (refreshToken) {
		req['refreshToken'] = refreshToken;

		return next();
	}
	return res
		.status(401)
		.json(result.output());
};

module.exports = checkHasJWTRefreshToken;
