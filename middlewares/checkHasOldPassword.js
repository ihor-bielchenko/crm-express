
/**
 * 
 */
const checkHasOldPassword = (req, res, next) => {
	if (req.body['passwordOld']) {
		return next();
	}

	return res
		.status(403)
		.json({
			message: 'Old password not specified.',
		});
};

module.exports = checkHasOldPassword;
