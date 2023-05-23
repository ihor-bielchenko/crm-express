const repository = require('./index.js');
const models = require('../models');
const Op = require('sequelize').Op;

/**
 * @return {int}
 */
const count = async function (props = {}) {
	return repository.count(models.Campaign, props);
};

/**
 * @param {object} props
 * @return {[object]}
 */
const getOne = async function (props= {}) {
	return await repository.getOne(models.Campaign, props);
};

/**
 * @param {object} props
 * @return {[object]}
 */
const getMany = async function (props= {}) {
	return await repository.getMany(models.Campaign, props);
};

/**
 * @param {[Object]} data
 * @return {void}
 */
const importData = async function (data) {
	// const campaignIds = data.map(affiliate => {
	// 	return affiliate.campaignId;
	// });
	//
	// await models.Campaign.destroy({
	// 	where: {
	// 		campaignId: {[Op.notIn]: campaignIds}
	// 	}
	// });

	await models.Campaign.bulkCreate(data, {
		fields:['campaignId', 'campaignName', 'dateCreated'],
		updateOnDuplicate: ['campaignId','campaignName', 'dateCreated']
	});
};

module.exports = ({
	getOne,
	count,
	getMany,
	importData,
});
