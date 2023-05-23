const cryptoJs = require('crypto-js');
const bcrypt = require('bcrypt');
const mailjet = require ('node-mailjet');
const models = require('../models');
const { Op } = require('sequelize');
const errors = require('../core/errors.js');
const repositoryUser = require('../repositories/user.js');
const referralService = require('../services/referral');
const serviceAffiliate = require('../services/affiliate.js');
const storageService = require('../services/storage');
const fileHelper = require('../helpers/file');
const enumUserRoles = require('../enums/userRoles');
const enumUserVerifyStatuses = require('../enums/userVerifyStatuses');
const { SERVER_URL } = require('../consts');

/**
 * @param {string} email
 * @return string
 */
const _generateVerifyKey = async (email) => {
	return Buffer
		.from(JSON.stringify({
			email,
			password: await bcrypt.hash(Math.random().toString(36).slice(-8) + email, 11),
		}))
		.toString('base64');
};

/**
 * @param {string} realPassword
 * @return {string}
 */
const _encryptPassword = async (realPassword = '') => {
	return await bcrypt.hash(realPassword, 10);
};

/**
 * @return {string}
 */
const _generateRefKey = () => {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);

};

/**
 * @param {string} realPassword
 * @param {string} bcryptHash
 * @return {string}
 */
const _checkPassword = async (realPassword = '', bcryptHash = '') => {
	try {
		return await bcrypt.compare(realPassword, bcryptHash);
	}
	catch (err) {
		throw new errors.CheckPassword(err);
	}
}

/**
 * @param {object} user
 * @return {object}
 */
const _generateTokens = async (user) => {
	const iat = Date.now();
	const affiliate = await models.Affiliate.findOne({
		attributes: [ 'clientSourceId' ],
		where: {
			userId: user.id,
		},
	});
	if(user.avatar){
		user.avatar = `${SERVER_URL}/${user.avatar}`;
	}

	return {
		user: {
			name: user.dataValues.name,
			avatar: user.dataValues.avatar,
			roleId: user.dataValues.roleId,
			statusId: user.dataValues.statusId,
			company: user.dataValues.company,
			phone: user.dataValues.phone,
			email: user.dataValues.email,
			country: user.dataValues.country,
			city: user.dataValues.city,
			region: user.dataValues.region,
			index: user.dataValues.index,
			address1: user.dataValues.address1,
			address2: user.dataValues.address2,
			messenger: user.dataValues.messenger,
			nickname: user.dataValues.nickname,
			facebook: user.dataValues.facebook,
			linkedin: user.dataValues.linkedin,
			referralKey: user.dataValues.referralKey,
			...(affiliate
				? { affId: affiliate.clientSourceId }
				: {}),
		},
		access_token: _generateAccessToken(user, iat, process.env.JWT_ACCESS_TIMEOUT),
		refresh_token: _generateRefreshToken(user, iat, process.env.JWT_REFRESH_TIMEOUT),
	};
};

/**
 * @param {object} user
 * @param {number} exp
 * @return {string}
 */
const _generateAccessToken = (user, iat, exp = process.env.JWT_ACCESS_TIMEOUT) => {
	const publicString = `${_createHeader()}.${_createPayload({
		exp,
		id: user.dataValues.id,
		email: user.dataValues.email,
		name: user.dataValues.name,
		roleId: user.dataValues.roleId,
		iat,
	})}`;

	return `${publicString}.${_createSignature(publicString.trim(), process.env.JWT_SECRET_ACCESS_KEY)}`;
};

/**
 * @param {object} user
 * @param {number} exp
 * @return {string}
 */
const _generateRefreshToken = (user, iat, exp = process.env.JWT_REFRESH_TIMEOUT) => {
	const publicString = `${_createHeader()}.${_createPayload({
		exp,
		id: user.dataValues.id,
		email: user.dataValues.email,
		name: user.dataValues.name,
		roleId: user.dataValues.roleId,
		iat,
	})}`;

	return `${publicString}.${_createSignature(publicString.trim(), process.env.JWT_SECRET_REFRESH_KEY)}`;
};

/**
 * @return {string}
 */
const _createHeader = () => {
	return Buffer
		.from(JSON.stringify({
			alg: 'HS256',
			typ: 'JWT',
		}))
		.toString('base64');
};

/**
 * @param {object} data
 * @return {string}
 */
const _createPayload = (data) => {
	return Buffer
		.from(JSON.stringify(data))
		.toString('base64');
};

/**
 * @param {string} publicString
 * @param {string} secretKey
 * @return {string}
 */
const _createSignature = (publicString, secretKey) => {
	return cryptoJs.HmacSHA256(publicString, secretKey);
};

/**
 * @param {string} token
 * @param {string} key
 * @param {object} payload
 * @return {boolean}
 */
const checkToken = (token = '', key = '', payload = {}) => {
	const publicString = `${_createHeader()}.${_createPayload(payload)}`;
	const recoveredToken = `${publicString}.${_createSignature(publicString.trim(), key)}`;

	return token === recoveredToken;
};

/**
 * @param {object} props
 * @reutrn {object}
 */
const register = async function ({
	name,
	email,
	phone,
	password,
	...props
}) {
	const verifyKey = await _generateVerifyKey(email);
	const encryptedPassword = await _encryptPassword(password);
	const referralKey = _generateRefKey();
	const referralParentId = await referralService.getReferralParentId({
		referralKey: props.referralKey,
		email
	});
	await referralService.deleteRequest({ email });

	const user = await repositoryUser.create({
		...props,
		name,
		email,
		phone: phone.replace(/[-()+\s]/g, ''),
		roleId: enumUserRoles.user.value,
		emailVerifyKey: verifyKey,
		password: encryptedPassword,
		referralKey,
		referralParentId,
	});

	try {
		const mailjetConnection = mailjet.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);
		const mailjetRequest = mailjetConnection
			.post('send', {
				'version': 'v3.1'
			})
			.request({
				'Messages': [{
					'From': {
						'Email': 'dev@webhub.one',
						'Name': 'Revenue Media',
					},
					'To': [{
						'Email': email,
						'Name': name,
					}],
					'Subject': `Confirmation account on Revenue Media`,
					'TextPart': `Confirmation account on Revenue Media`,
					'HTMLPart': `<div>
						<h3>Completion of registration</h3>
						<p>To activate your account follow the link: <a href="${process.env.FRONT_URL}/recovery/verify?key=${verifyKey}">${process.env.FRONT_URL}/recovery/verify?key=${verifyKey}</a></p>
					</div>`,
					'CustomID': 'AppGettingStartedTest',
				}],
		});
	}
	catch (err) {
		throw new Error(`Error when sending a link to activate an account by mail. [${err.message}]`);
	}
	return {
		name: user.dataValues.name,
	};
};

/**
 * @param {object} props
 * @return {object}
 */
const verify = async ({ email, key }) => {
	const user = await repositoryUser.getOne({ email });

	if (user.emailVerifiedAt) {
		throw new Error('Current account already verified.');
	}
	if (user.emailVerifyKey !== key) {
		throw new Error('Key not validated.');
	}
	if ((Date.now() - user.createdAt.getTime()) > 86400000) {
		throw new Error('Key expired.');
	}
	user.update({
		emailVerifyKey: '',
		emailVerifiedAt: new Date(),
	});

	return {
		emailVerifiedAt: user.emailVerifiedAt,
	};
};

/**
 * @param {object} props
 * @reutrn {object}
 */
const login = async function ({ login: loginStr, password }) {
	const user = await repositoryUser.getOne({
		[Op.or]: [
			{ email: loginStr },
			{ phone: loginStr.replace(/[-()+\s]/g, '') },
		],
	});

	if (!user) {
		throw new Error('Email, phone or password are incorrect.');
	}
	if (await _checkPassword(password, user.dataValues.password)) {
		return await _generateTokens(user);
	}
	throw new Error('Wrong password specified.');
};

/**
 * @param {object} props
 * @reutrn {object}
 */
const refresh = async function ({ email }) {
	const user = await repositoryUser.getOne({ email });

	if (user) {
		if (user.avatar) {
			user.avatar = fileHelper.convertOriginToSmallAvatarPath(`${user.avatar}`);
		}
		return await _generateTokens(user);
	}
	throw new Error('User not found.');
};

/**
 * @param {object} props
 * @reutrn {object}
 */
const recovery = async function ({ email }) {
	const user = await repositoryUser.getOne({ email });

	if (!user) {
		throw new Error('User not found.');
	}
	if (!user.emailVerifiedAt) {
		throw new Error('The current user has not activated an account.');
	}
	const verifyKey = await _generateVerifyKey(email);

	user.update({ emailVerifyKey: verifyKey });

	try {
		const mailjetConnection = mailjet.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);
		const mailjetRequest = mailjetConnection
			.post('send', {
				'version': 'v3.1'
			})
			.request({
				'Messages': [{
					'From': {
						'Email': 'dev@webhub.one',
						'Name': 'Revenue Media',
					},
					'To': [{
						'Email': email,
						'Name': user.name,
					}],
					'Subject': `Account recovery on Revenue Media`,
					'TextPart': `Account recovery on Revenue Media`,
					'HTMLPart': `<div>
						<h3>You have created a request to restore access to your account "${user.name}"</h3>
						<p>Follow the link to continue: <a href="${process.env.FRONT_URL}/recovery/reset?key=${verifyKey}">${process.env.FRONT_URL}/recovery/reset?key=${verifyKey}</a></p>
					</div>`,
					'CustomID': 'AppGettingStartedTest',
				}],
		});
	}
	catch (err) {
		throw new Error(`Error when sending a link to restore an account by mail. [${err.message}]`);
	}
	return {
		name: user.name,
	};
};

/**
 * @param {object} props
 * @return {object}
 */
const reset = async ({
	key,
	email,
	password,
}) => {
	const user = await repositoryUser.getOne({ email });

	if (!user.emailVerifiedAt) {
		throw new Error('Current account already verified.');
	}
	if (user.emailVerifyKey !== key) {
		throw new Error('Key not validated.');
	}
	const encryptedPassword = await _encryptPassword(password);

	user.update({
		password: encryptedPassword,
		emailVerifyKey: '',
	});

	return {
		emailVerifiedAt: user.emailVerifiedAt,
	};
};

/**
 * @param {int} id
 * @param {object} params
 * @reutrn {object}
 */
const password = async function (id, { passwordOld, passwordNew }) {
	const user = await repositoryUser.getOne({ id });

	if (!user) {
		throw new Error('User not found.');
	}
	if (!await _checkPassword(passwordOld, user.dataValues.password)) {
		throw new Error('Wrong current password specified.');
	}
	const encryptedPassword = await _encryptPassword(passwordNew);

	user.update({ password: encryptedPassword });

	return {
		name: user.name,
	};
};

/**
 * @param {int} id
 * @param {object} params
 * @reutrn {object}
 */
const update = async function (id, { byEmail, ...params }) {
	const userModel = await repositoryUser.getOne((byEmail)
		? { email: byEmail }
		: { id });
	const userModelId = (byEmail && userModel)
		? userModel.id
		: id;

	if (params.verifyStatusId === enumUserVerifyStatuses.approved.value) {
		if (!params.affId) {
			throw new errors.BadRequest({ message: `affId: ${params.affId}` });
		}
		const affiliateModel = await serviceAffiliate.checkAffiliate({ clientSourceId: params.affId });

		if (!affiliateModel) {
			throw new errors.BadRequest({message: `affliate not exists`});
		}

		if (affiliateModel.userId) {
			throw new errors.BadRequest({message: `user with affId: ${params.affId} already exists`});
		}
		await serviceAffiliate.attachUser(userModel, affiliateModel);
	}

	if (params.avatar) {
		const file = await storageService.uploadFile(params.avatar, await fileHelper.makeAvatarPath(userModelId), true);
		params.avatar = file.uploadPath;
	}

	userModel.set(params);
	await userModel.save(params);
	delete userModel.dataValues.password;

	return {
		...userModel.dataValues,
	};
};

/**
 * @reutrn {object}
 */
const getRequests = async function () {
	const users = await repositoryUser.getRequests();
	return users.map(user => {
		return {
			id: user.id,
			name: user.name,
			nickname: user.nickname,
			email: user.email,
			phone: user.phone,
			country: user.country,
			date: user.createdAt,
			status: user.status,
		};
	});
};

/**
 * @param {object} params
 * @reutrn {object}
 */
const getRequestsHistory = async function (params = {}) {
	const users = await repositoryUser.getRequestHistory(params);
	const response = users.rows.map(user => {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			country: user.country,
			date: user.createdAt,
			status: user.status,
		};
	});
	return {
		count: users.count,
		users: response
	};
};

const validateEmail = function (value = '') {
	return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value));
};

const validatePhone = function (value = '') {
	const valueParsed = value.replace(/[-()+\s]/g, '');

	return (valueParsed.length >= 10
		&& Number(valueParsed) > 1);
};

/**
 * @param {object} params
 * @reutrn {object}
 */
const getUsers = async function (params = {}) {
	const users = await repositoryUser.getRequestHistory(params);
	const response = users.rows.map(user => {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			country: user.country,
			date: user.createdAt,
			status: user.status,
		};
	});
	return {
		count: users.count,
		users: response
	};
};

const getOne = async function (userId) {
	const user = await repositoryUser.getOne({ id: userId });

	return user;
};

module.exports = ({
	getRequestsHistory,
	getRequests,
	update,
	checkToken,
	register,
	verify,
	login,
	refresh,
	recovery,
	reset,
	password,
	validateEmail,
	validatePhone,
	getOne,
});
