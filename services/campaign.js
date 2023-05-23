const checkoutChampApi = require("./checkout-champ-api");
const campaignRepository = require("../repositories/campaigns");

/**
 * @return {void}
 */
const loadCampaigns = async function () {
	const args = {};
	args.page = 1;
	args.resultsPerPage = 200;
	const campaignResponse = await checkoutChampApi.getCampaigns(args);
	const paginationResult = checkoutChampApi.pagination(campaignResponse.totalResults, campaignResponse.resultsPerPage);

	for (let currentPage = args.page; currentPage <= paginationResult.countAllPages; currentPage++) {
		const campaignResponse = await checkoutChampApi.getCampaigns(args);
		await campaignRepository.importData(campaignResponse.data);
		console.info(`page: ${currentPage}, count campaigns on page: ${campaignResponse.data.length}`);
	}
};

module.exports = ({
	loadCampaigns,
});
