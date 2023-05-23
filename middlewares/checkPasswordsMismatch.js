
/**
 * 
 */
const checkPasswordsMismatch = (req, res, next) => {
	if (req.body['password'] === req.body['passwordConfirm']) {
		return next();
	}
	return res
		.status(403)
		.json({
			message: 'Passwords mismatch',
		});
};

module.exports = checkPasswordsMismatch;
