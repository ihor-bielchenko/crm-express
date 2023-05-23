
/**
 * 
 */
const checkNewPasswordsMismatch = (req, res, next) => {
	if (req.body['passwordNew1'] === req.body['passwordNew2']) {
		return next();
	}
	return res
		.status(403)
		.json({
			message: 'Passwords mismatch',
		});
};

module.exports = checkNewPasswordsMismatch;
