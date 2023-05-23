const path = require('path');
require('dotenv').config({path: path.resolve(__dirname+'/.env')});

const {
  CHECKOUT_CHAMP_API_LOGIN_ID,
  CHECKOUT_CHAMP_API_PASSWORD,
  CHECKOUT_CHAMP_TRANSACTION_URL,
  CHECKOUT_CHAMP_AFFILIATE_URL,
  CHECKOUT_CHAMP_CAMPAIGN_URL,
  CHECKOUT_CHAMP_GET_ORDERS_URL,
  SERVER_URL,
  AUTH_STATUS,
} = process.env;

const makeCheckoutChampUrl = (url) => `${url}/?loginId=${CHECKOUT_CHAMP_API_LOGIN_ID}&password=${CHECKOUT_CHAMP_API_PASSWORD}`;

module.exports = {
  checkoutChampTransactionsUrl: makeCheckoutChampUrl(CHECKOUT_CHAMP_TRANSACTION_URL),
  checkoutChampAffiliateUrl: makeCheckoutChampUrl(CHECKOUT_CHAMP_AFFILIATE_URL),
  checkoutChampCampaignUrl: makeCheckoutChampUrl(CHECKOUT_CHAMP_CAMPAIGN_URL),
  checkoutChampGetOrdersUrl: makeCheckoutChampUrl(CHECKOUT_CHAMP_GET_ORDERS_URL),
  SERVER_URL: SERVER_URL,
  AUTH_STATUS: AUTH_STATUS === 'true',
};
