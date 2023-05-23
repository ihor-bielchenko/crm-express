const axios = require('axios');
const logs = require('./logs');
const checkoutChampApi = require('./checkout-champ-api');
const affiliateRepository = require('./../repositories/affiliates');
const campaignRepository = require('./../repositories/campaigns');
const orderRepository = require('./../repositories/orders');



/**
 * @param {object} props
 * @reutrn {object}
 */
const upsell = async function (props) {
	const config = {
		method: 'post',
		url: `https://api.konnektive.com/order/import/?loginId=webhubdeveloper&password=revenue-media-bannerjfwejf&firstName=${props.firstName}&lastName=${props.lastName}&postalCode=${props.postalCode}&city=${props.city}&state=${props.state}&country=${props.country}&emailAddress=${props.emailAddress}&phoneNumber=${props.phoneNumber}&shipFirstName=${props.firstName}&shipLastName=${props.lastName}&shipPostalCode=${props.postalCode}&shipCity=${props.city}&shipState=${props.state}&shipCountry=${props.country}&paySource=CREDITCARD&cardNumber=${props.cardNumber}&cardMonth=${props.cardMonth}&cardYear=${props.cardYear}&cardSecurityCode=${props.cardSecurityCode}&campaignId=${props.campaignId}&product1_id=${props.product1_id}&product1_qty=1&address1=${props.address1}&shipAddress1=${props.address1}`,
		headers: {},
		data: '',
	};

	if (props.address2) {
		config.url += `&address2=${props.address2}`;
		config.url += `&shipAddress2=${props.address2}`;
	}
	if (props.affId) {
		config.url += `&affId=${props.affId}`;
	}
	const response = await axios(config);

	await logs.upsell('CREATE',{
 		props,
		config,
		response: response.data
	});

	return response.data;
};

/**
 * @param {Object} args
 * @return {void}
 */
const loadOrders = async function (args) {
	args.page = 1;
	args.resultsPerPage = 200;

	const orderResponse = await checkoutChampApi.getOrders(args);
	const paginationResult = checkoutChampApi.pagination(orderResponse.totalResults, orderResponse.resultsPerPage);

	const affiliates = await affiliateRepository.getAffiliates({ user: true });
	const campaigns = await campaignRepository.getMany();

	for (let currentPage = args.page; currentPage <= paginationResult.countAllPages; currentPage++) {
	  args.page = currentPage;

	  const orderApi = await checkoutChampApi.getOrders(args);

	  const orders = orderApi.data.map(order => {
	    let affiliate = affiliates.find(affiliate => affiliate.clientSourceId === order.affId);
	    let campaign = campaigns.find(campaign => campaign.campaignId === parseInt(order.campaignId));

	    return {
	      ...order,
	      affId: affiliate ? affiliate.id : null,
	      campaignId: campaign ? campaign.id: null,
	    };
	  });
	  await orderRepository.importData(orders);
	console.info(`page: ${currentPage}, count transactions on page: ${orderApi.data.length}`);
	}
};


module.exports = ({
	upsell,
	loadOrders
});
