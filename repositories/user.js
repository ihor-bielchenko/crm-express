const repository = require('./index.js');
const models = require('../models');
const Op = require('sequelize').Op;
const userVerifyStatusesEnum = require('../enums/userVerifyStatuses');
const userRolesEnum = require('../enums/userRoles');
const errors = require("../core/errors");
const fileHelper = require("../helpers/file");
const { SERVER_URL } = require("../consts");

/**
 * @param {object} params
 * @return {[object]}
 */
const count = async function (params = {}) {
	return repository.count(models.User, params);
};

/**
 * @param {object} params
 * @return {[object]}
 */
const getUsers = async function (params = {}) {
	const queryWithFilters = makeUserQuery(params);
	const users = await models.User.findAll(queryWithFilters);
	return users.map(user => {
			return {
				...user.dataValues,
				avatar: user.avatar ? fileHelper.convertOriginToSmallAvatarPath(`${SERVER_URL}/${user.avatar}`) : null,
				campaigns: user.affiliate ? user.affiliate.campaigns : [],
				referrals: user.referrals ? user.referrals : []
			};
		});
};

/**
 * @param {object} params
 * @return {[object]}
 */
const getUsersPagination = async function (params = {}) {
	const queryWithFilters = makeUserQuery(params);
	const userModels = await getManyPaginate(queryWithFilters, params.page, params.countOnPage);
	const users = userModels.rows.map(user => {
		return {
			...user.dataValues,
			avatar: user.avatar ? fileHelper.convertOriginToSmallAvatarPath(`${SERVER_URL}/${user.avatar}`) : null,
			campaigns: user.affiliate ? user.affiliate.campaigns : []
		};
	});
	return {
		count: userModels.count,
		users: users
	};
};

/**
 * @param {object} params
 * @return {object}
 */
const getUser = async function (params = {}) {
	const queryWithFilters = makeUserQuery(params);
	const user = await models.User.findOne(queryWithFilters);

	if(!user){
		throw new  errors.RepositoryModelNotFound(params);
	}
	return {
		...user.dataValues,
		campaigns: user.affiliate ? user.affiliate.campaigns : [],
	};
};

/**
 * @param {object} props
 * @return {object}
 */
const create = async function (props) {
	return await repository.create(models.User, props);
};


/**
 * @param {int} id
 * @param {object} props
 * @return {object}
 */
const update = async function (id,props) {
	return repository.update(models.User, id, props);
};

/**
 * @param {object} props
 * @return {object}
 */
const login = async function (props) {
	return await repository.getOne(models.User, props);
};

/**
 * @param {object} props
 * @return {object}
 */
const refresh = async function (props) {
	return {};
};

/**
 * @param {object} props
 * @return {object}
 */
const recovery = async function (props) {
	return {};
};

/**
 * @param {object} props
 * @return {object}
 */
const getOne = async function (props) {
	return await repository.getOne(models.User, props);
};


/**
 * @param {object} props
 * @return {object}
 */
const getMany = async function (props) {
	return repository.getMany(models.User, props);
};

/**
 * @param {object} query
 * @param {int} page
 * @param {int} countOnPage
 * @return {object}
 */
const getManyPaginate = async function (query,  page = 1, countOnPage= 15) {
	return repository.paginate(models.User, query, page, countOnPage);
};

/**
 * @param {object} props
 * @return {object}
 */
const getRequestHistory = async function ({ filters, page, countOnPage }) {
	const verifyStatuses = [
		userVerifyStatusesEnum.approved.value,
		userVerifyStatusesEnum.canceled.value,
	];
	const userRoleId = userRolesEnum.user.value;
	const query = {
		where: {
			verifyStatusId: verifyStatuses,
			roleId: userRoleId,
		}
	};

	if(filters && filters.startDate && filters.endDate) {
		const startDate = new Date(filters.startDate);
		const endDate = new Date(filters.endDate);
		endDate.setDate(endDate.getDate() + 1);
		query.where.createdAt = {
			[Op.and]: {
				[Op.gte]: startDate,
				[Op.lte]: endDate
			}
		};
	}
	return getManyPaginate(query, page, countOnPage);
};

/**
 * @return {object}
 */
const getRequests = async function () {
	return getMany( {
		verifyStatusId: userVerifyStatusesEnum.newRequest.value,
		roleId: userRolesEnum.user.value
	});
};

/**
 * @param {object} params
 * @return {{where: {roleId: int}}}
 */
const makeUserQuery = function (params = {}) {
	const query = {
		include: [],
		where: {
			roleId: userRolesEnum.user.value,
			verifyStatusId: userVerifyStatusesEnum.approved.value
		}
	};

	if (params.id) {
		query.where.id = params.id;
	}

	if (params.referralParentId) {
		query.where.referralParentId = params.referralParentId;
	}

	if (params.campaigns === true) {
		query.include.push({
			model: models.Affiliate,
			as: 'affiliate',
			include: [
				{
					model: models.Campaign,
					as: 'campaigns',
				},
			],
		});
	}
	if (params.affiliate === true) {
		query.include.push({
			model: models.Affiliate,
			as: 'affiliate',
		});
	}
	if (params.referrals === true) {
		query.include.push({
			model: models.User,
			as: 'referrals',
			include: [
				{
					model: models.Affiliate,
					as: 'affiliate',
					include: [
						{
							model: models.Campaign,
							as: 'campaigns',
						},
					],
				},
			],
		});
	}

		if (params.status === true) {
			query.include.push({
				model: models.UserStatus,
				as: 'status',
			});
		}

		if (Array.isArray(params.order) && params.order.length > 0) {
			query.order = params.order.map(param => {
					return [param.field, param.value];
			});
		}
	return query;
};

module.exports = ({
	getRequests,
	getRequestHistory,
	getManyPaginate,
	getMany,
	update,
	getOne,
	create,
	login,
	refresh,
	recovery,
	getUsers,
	getUsersPagination,
	getUser,
	count,
});
