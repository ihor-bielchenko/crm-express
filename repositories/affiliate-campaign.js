const models = require('../models');

/**
 * @param {[object]} campaigns
 * @return {void}
 */
const importData = async function (campaigns = []) {
	// await models.AffiliateCampaign.destroy({
	// 	truncate : true,
	// 	cascade: false
	// });

	await models.AffiliateCampaign.bulkCreate(campaigns, {
		fields:["affId", "campaignId"],
		updateOnDuplicate: [ "affId","campaignId"]
	});
};

module.exports = ({
	importData,
});
