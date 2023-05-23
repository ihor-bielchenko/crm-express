const repositoryAffiliate = require('../repositories/affiliates');
const serviceStatistic = require('../services/statistic');
const checkoutChampApi = require("./checkout-champ-api");
const affiliateRepository = require("../repositories/affiliates");
const campaignRepository = require("../repositories/campaigns");
const affiliateCampaignRepository = require("../repositories/affiliate-campaign");

/**
 * @param {object} props
 * @return {object}
 */
const checkAffiliate = async function (props) {
  await loadAffiliates();
  return await getAffiliate(props);
};

/**
 * @param {object} props
 * @return {object}
 */
const getAffiliate = async function (props) {
	return repositoryAffiliate.getOne(props);
};

/**
 * @param {object} user
 * @param {object} affiliate
 * @return {object}
 */
const attachUser = async function (user, affiliate) {
	if (!affiliate.userId) {
		return repositoryAffiliate.attachUser(user, affiliate);
	}
	throw new Error(`User with affId "${affiliate.clientSourceId}" already exists`);
};


/**
 * @return {void}
 */
const loadAffiliates = async function () {
	const affiliateResponse = await checkoutChampApi.getAffiliates();
	const {
		affiliates: affiliatesApi,
		campaigns: campaignsApi,
	} = affiliateResponse;

	await affiliateRepository.importData(affiliatesApi);
	const affiliates = await affiliateRepository.getMany();
	const campaigns = await campaignRepository.getMany();

	const affiliateCampaigns = campaignsApi.map(campaign => {
		const affiliate = affiliates.find(affiliate => affiliate.clientSourceId === campaign.clientSourceId);
		const campaignLocal = campaigns.find(campaignLocal => campaignLocal.campaignId === campaign.campaignId) || { campaignId: null };
		return {
			affId: affiliate.id,
			campaignId: campaignLocal.id,
		};
	}).filter(response => !!response.campaignId);
	await affiliateCampaignRepository.importData(affiliateCampaigns);
};

module.exports = ({
  attachUser,
	getAffiliate,
  checkAffiliate,
	loadAffiliates,
});
