const coreHttpResponseResultTemplate = require('../core/httpResponseResultTemplate.js');
const userRolesEnum = require('../enums/userRoles');

/**
 *
 */
const checkAdmin = (req, res, next) => {
	if (req.authUser && req.authUser.roleId === userRolesEnum.admin.value) {
		return next();
	}
	const result = coreHttpResponseResultTemplate({
		message: 'not access',
	});

	return res
		.status(401)
		.json(result.output());
};

module.exports = checkAdmin;
