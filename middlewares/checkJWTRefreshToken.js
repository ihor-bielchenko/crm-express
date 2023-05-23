const coreHttpResponseResultTemplate = require('../core/httpResponseResultTemplate.js');
const serviceUser = require('../services/user.js');

/**
 * 
 */
const checkJWTRefreshToken = (req, res, next) => {
	const result = coreHttpResponseResultTemplate({
		message: 'refresh_token is not valid',
	});
	console.log('req.refreshToken', req.refreshToken);
	const split = req.refreshToken.split('.');
	const payload = JSON.parse(Buffer.from(split[1], 'base64').toString());
	
	if (!serviceUser.checkToken(req.refreshToken, process.env.JWT_SECRET_REFRESH_KEY, { 
		...payload, 
		exp: process.env.JWT_REFRESH_TIMEOUT, 
	})) {
		return res
			.status(401)
			.json(result.output());
	}

	if ((Date.now() - Number(process.env.JWT_REFRESH_TIMEOUT)) > Number(payload.iat)) {
		result.setMessage('refresh_token is old');
		return res
			.status(401)
			.json(result.output());
	}
	req.query['email'] = payload.email;
	return next();
};

module.exports = checkJWTRefreshToken;
