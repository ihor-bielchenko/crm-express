
/**
 * 
 */
const checkHasPasswordConfirm = (req, res, next) => {
	if (req.body['passwordConfirm']) {
		return next();
	}
	return res
		.status(403)
		.json({
			message: 'Confirm password not specified',
		});
};

module.exports = checkHasPasswordConfirm;
