const coreHttpResponseResultTemplate = require('../core/httpResponseResultTemplate.js');
const userRolesEnum = require('../enums/userRoles');

/**
 *
 */
const checkAvatar = (req, res, next) => {
	// if (req.authUser && (req.authUser.roleId === userRolesEnum.admin.value || req.path.indexOf(`/${req.authUser.id}/`) !== -1)) {
	// 	return next();
	// }

	if (req.authUser) {
		return next();
	}

	const result = coreHttpResponseResultTemplate({
		message: 'not access',
	});

	return res
		.status(401)
		.json(result.output());
};

module.exports = checkAvatar;
