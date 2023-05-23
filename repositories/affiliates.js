const repository = require('./index.js');
const models = require('../models');
const Op = require('sequelize').Op;

/**
 * @param {object} props
 * @return {[object]}
 */
const getMany = async function (props = {}) {
	return await repository.getMany(models.Affiliate, props);
};

/**
 * @param {object} props
 * @return {object}
 */
const getOne = async function (props) {
	return await repository.getOne(models.Affiliate, props);
};

/**
 * @param {object} props
 * @return {object}
 */
const getAffiliates = async function (props = {}) {
	const query = {
		include: [
			{
				model: models.User,
				as: 'user',
			}
		],
	};
	if (props.user === true) {
		query.include.push({
			model: models.User,
			as: 'user',
		});
	}
	return models.Affiliate.findAll(query);
};

/**
 * @param {object} user
 * @param {object} affiliate
 * @return {[object]}
 */
const attachUser = async function (user, affiliate) {
	affiliate.userId = user.id;
	affiliate.save();
	return affiliate;
};

/**
 * @param {[Object]} affiliates
 * @return {void}
 */
const importData = async function (affiliates = []) {
	// const clientSourceIds = affiliates.map(affiliate => {
	// 	return affiliate.clientSourceId;
	// });
	//
	// await models.Affiliate.destroy({
	// 	where: {
	// 		clientSourceId: {[Op.notIn]: clientSourceIds},
	// 		userId: null,
	// 	}
	// });

	await models.Affiliate.bulkCreate(affiliates, {
		include: models.Campaigns,
		fields:["sourceId", "clientSourceId", "sourceTitle"],
		updateOnDuplicate: [ "sourceTitle","sourceId", "clientSourceId"]
	});
};

module.exports = ({
	getOne,
	attachUser,
	getMany,
	importData,
	getAffiliates,
});
