const fetch = require('./fetch');

const {
  checkoutChampTransactionsUrl,
  checkoutChampGetOrdersUrl,
  checkoutChampAffiliateUrl,
  checkoutChampCampaignUrl,
} = require('../consts');

/**
 * @param {String} url
 * @param {Object} args
 * @return {String}
 */
const makeUrlArgs = async function(url, args = {}){
  if(args.startDate){
    url += `&startDate=${args.startDate}`;
  }

  if(args.endDate){
    url += `&endDate=${args.endDate}`;
  }

  if(args.page){
    url += `&page=${args.page}`;
  }

  if(args.resultsPerPage){
    url += `&resultsPerPage=${args.resultsPerPage}`;
  }
  return url;
};

/**
 * @param {Number} totalItems
 * @param {Number} itemsByPage
 * @return {Number}
 */
const pagination = function (totalItems, itemsByPage) {
  const countAllPages = Math.ceil(totalItems/itemsByPage);
  return { countAllPages };
};

/**
 * @param {Object} args
 * @return {Object}
 */
const fetchTransactions = async function (args) {
  const url = await makeUrlArgs(checkoutChampTransactionsUrl, args);
  return fetch({
    url,
    method: 'POST',
  });
};

/**
 * @param {Object} args
 * @return {Object}
 */
const fetchOrders = async function (args) {
  const url = await makeUrlArgs(checkoutChampGetOrdersUrl, args);
  return fetch({
    url,
    method: 'POST',
  });
};

/**
 * @param {Object} args
 * @return {Object}
 */
const fetchAffiliates = async function (args) {
  const url = await makeUrlArgs(checkoutChampAffiliateUrl, args);
  return fetch({
    url,
    method: 'POST',
  });
};

/**
 * @param {Object} args
 * @return {Object}
 */
const fetchCampaigns = async function (args) {
  const url = await makeUrlArgs(checkoutChampCampaignUrl, args);
  return fetch({
    url,
    method: 'POST',
  });
};

/**
 * @return {[Object]}
 */
const getCampaigns = async function (args) {
  const response = await fetchCampaigns(args);
  const result = {
    totalResults: response.body.message.totalResults,
    resultsPerPage: response.body.message.resultsPerPage,
    page: response.body.message.page
  };
  result.data = Object.keys(response.body.message.data).map(campaign => {
    return {
      campaignId: response.body.message.data[campaign].campaignId,
      campaignName: response.body.message.data[campaign].campaignName,
      dateCreated: response.body.message.data[campaign].dateCreated,
    };
  });
  return result;
};

/**
 * @param {Object} args
 * @return {Object}
 */
const getAffiliates = async function (args = {}) {
  const response = await fetchAffiliates(args);
  const campaigns = [];
  const affiliates = response.body.message.map(affiliate => {
    return  {
      sourceId: affiliate.sourceId,
      clientSourceId: affiliate.clientSourceId,
      sourceTitle: affiliate.sourceTitle,
      campaigns: affiliate.campaigns
    };
  });
  response.body.message.map(affiliate => {
    affiliate.campaigns.map(campaign => {
      campaigns.push({
        campaignId: campaign.campaignId,
        clientSourceId: affiliate.clientSourceId
      });
    });
  });
  return {
    affiliates,
    campaigns
  };
};

/**
 * @param {Object} args
 * @return {[Object]}
 */
const getTransactions = async function (args) {
  const response = await fetchTransactions(args);
  const result = {
    totalResults: response.body.message.totalResults,
    resultsPerPage: response.body.message.resultsPerPage,
    page: response.body.message.page
  };

  if(!response.body.message.data){
    return [];
  }

  result.data = response.body.message.data.filter(function(transaction) {
    if(!Array.isArray(transaction.items)){
      return false;
    }
    return transaction.items.find(product => product.product.toLowerCase().includes('ebook'));
  }).map(transaction => {
    return {
      affId: transaction.affId,
      campaignId: transaction.campaignId,
      orderId: transaction.orderId,
      transactionId: transaction.transactionId,
      totalAmount: transaction.totalAmount,
      responseType: transaction.responseType,
      product: transaction.items[0].product,
      itemStatus: transaction.items[transaction.items.length - 1].status ?? null,
      clientOrderId: transaction.clientOrderId,
      billingCycleNumber: transaction.billingCycleNumber,
      dateCreated: transaction.dateCreated
    };
  });
  return result;
};

/**
 * @param {Object} args
 * @return {[Object]}
 */
const getOrders = async function (args) {
  const response = await fetchOrders(args);
  const result = {
    totalResults: response.body.message.totalResults,
    resultsPerPage: response.body.message.resultsPerPage,
    page: response.body.message.page
  };

  if(!response.body.message.data){
    return [];
  }
  result.data = response.body.message.data.filter(function(order) {
    let result = false;

    if(!order.items){
      return false;
    }

    Object.keys(order.items).map(function(key, index) {
      if (order.items[key].name.toLowerCase().includes('ebook')){
        result = true;
      }
    });
    return result;
  }).map(order => {
    return {
      affId: order.affId,
      campaignId: order.campaignId,
      orderId: order.orderId,
      actualOrderId: order.actualOrderId,
      clientOrderId: order.clientOrderId,
      totalAmount: order.totalAmount,
      orderStatus: order.orderStatus,
      orderType: order.orderType,
      dateCreated: order.dateCreated
    };
  });
  return result;
};

module.exports = {
  getCampaigns,
  getAffiliates,
  getTransactions,
  pagination,
  getOrders,
};
