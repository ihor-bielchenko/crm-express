const models = require('../models');
const { paginate: indexPaginate } = require('./index');

const paginate = function (query, page = 1, countOnPage = 15) {
	return indexPaginate(models.Order, query, page, countOnPage);
};

/**
 * @param {[Object]} data
 * @return {void}
 */
const importData = async function (data) {
	 await models.Order.bulkCreate(data, {
		fields:['affId','campaignId','orderId','actualOrderId','clientOrderId', 'totalAmount','dateCreated','orderStatus','orderType'],
		updateOnDuplicate: ['affId','campaignId', 'orderId','actualOrderId','clientOrderId', 'totalAmount','dateCreated','orderStatus','orderType'],

	});
};

module.exports = ({
	importData,
	paginate
});
