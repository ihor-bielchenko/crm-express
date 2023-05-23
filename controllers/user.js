const coreHttpResponseResultTemplate = require('../core/httpResponseResultTemplate.js');
const userService = require('../services/user');

/**
 *
 */
const update = async (req, res) => {
	try {
		if(req.files && req.files.avatar) {
			req.body.avatar = req.files.avatar;
		}
		const data = await userService.update(req.authUser.id, req.body);

		return res
			.json({
				message: 'User successfully updated',
				data,
			});
	}
	catch (err) {
		return res
			.status(500)
			.json({
				message: err.message,
			});
	}
	return res
		.status(500)
		.json({
			message: 'Request failed. Unknown error.'
		});
};

/**
 *
 */
const getRequests = async (req, res) => {
	const result = coreHttpResponseResultTemplate();

	try {
		result.setData(await userService.getRequests());
	}
	catch (err) {
		console.error('Caught Error', {
			message: err.message,
			statusCode: err.statusCode,
		});
		result.setMessage(err.message);

		return res
			.status(err.statusCode ?? 500)
			.json(result.output());
	}
	return res.json(result.output());
};

const adminGetOne = async (req, res) => {
	try {
		const userId = req.params.userId;
		const data = await userService.getOne(userId);

		return res
			.json({
				message: 'Success query',
				data,
			});
	}
	catch (err) {
		return res
			.status(500)
			.json({
				message: err.message,
			});
	}
	return res
		.status(500)
		.json({
			message: 'Request failed. Unknown error.'
		});
};

const adminUpdateUserByEmail = async (req, res) => {
	try {
		const data = await userService.update(null, req.body);

		return res
			.json({
				message: 'User successfully updated',
				data,
			});
	}
	catch (err) {
		return res
			.status(500)
			.json({
				message: err.message,
			});
	}
	return res
		.status(500)
		.json({
			message: 'Request failed. Unknown error.'
		});
};

/**
 *
 */
const adminUpdateUser = async (req, res) => {
	const result = coreHttpResponseResultTemplate();

	try {
		result.setData(await userService.update(req.params.userId, req.body));
	}
	catch (err) {
		console.error('Caught Error', {
			message: err.message,
			statusCode: err.statusCode,
		});
		result.setMessage(err.message);

		return res
			.status(err.statusCode ?? 500)
			.json(result.output());
	}
	return res.json(result.output());
};

/**
 *
 */
const getRequestsHistory = async (req, res) => {
	const result = coreHttpResponseResultTemplate();

	try {
		result.setData(await userService.getRequestsHistory(req.body));
	}
	catch (err) {
		console.error('Caught Error', {
			message: err.message,
			statusCode: err.statusCode,
		});
		result.setMessage(err.message);

		return res
			.status(err.statusCode ?? 500)
			.json(result.output());
	}
	return res.json(result.output());
};

module.exports = {
	getRequestsHistory,
	adminUpdateUser,
	adminUpdateUserByEmail,
	getRequests,
	update,
	adminGetOne,
};
