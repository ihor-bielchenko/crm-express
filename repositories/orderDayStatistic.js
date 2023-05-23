const models = require("../models");

const {
  paginate: indexPaginate,
  getMany,
  groupByPaginate,
} = require("./index");

const Sequelize = require('sequelize');
const Op = require('sequelize').Op;

const getQueryDayStatistic = async function (params) {
  const query = {
    attributes: [
      [Sequelize.literal(`SUM(totalAmount)`), 'totalAmount'],
      [Sequelize.literal(`SUM(rebillsAmount)`), 'rebillsAmount'],
      [Sequelize.literal(`SUM(affRebillsAmount)`), 'affRebillsAmount'],
      [Sequelize.literal(`SUM(affAmount)`), 'affAmount'],
      [Sequelize.literal(`SUM(referralAmount)`), 'referralAmount'],
      [Sequelize.literal(`SUM(companyAmount)`), 'companyAmount'],
      [Sequelize.literal(`SUM(affOriginAmount)`), 'affOriginAmount'],
      [Sequelize.literal(`SUM(referralOriginAmount)`), 'referralOriginAmount'],
      [Sequelize.literal(`SUM(companyOriginAmount)`), 'companyOriginAmount'],
      [Sequelize.literal(`SUM(newSaleCompleteCount)`), 'newSaleCompleteCount'],
      [Sequelize.literal(`SUM(newSaleCanceledCount)`), 'newSaleCanceledCount'],
      [Sequelize.literal(`SUM(newSaleRefundedCount)`), 'newSaleRefundedCount'],
      [Sequelize.literal(`SUM(newSaleDeclinedCount)`), 'newSaleDeclinedCount'],
      [Sequelize.literal(`SUM(recurringCompleteCount)`), 'recurringCompleteCount'],
      [Sequelize.literal(`SUM(recurringCanceledCount)`), 'recurringCanceledCount'],
      [Sequelize.literal(`SUM(recurringRefundedCount)`), 'recurringRefundedCount'],
      [Sequelize.literal(`SUM(recurringDeclinedCount)`), 'recurringDeclinedCount'],

      [Sequelize.literal(`SUM(newSaleCompleteOriginCount)`), 'newSaleCompleteOriginCount'],
      [Sequelize.literal(`SUM(newSaleCanceledOriginCount)`), 'newSaleCanceledOriginCount'],
      [Sequelize.literal(`SUM(newSaleRefundedOriginCount)`), 'newSaleRefundedOriginCount'],
      [Sequelize.literal(`SUM(newSaleDeclinedOriginCount)`), 'newSaleDeclinedOriginCount'],
      [Sequelize.literal(`SUM(recurringCompleteOriginCount)`), 'recurringCompleteOriginCount'],
      [Sequelize.literal(`SUM(recurringCanceledOriginCount)`), 'recurringCanceledOriginCount'],
      [Sequelize.literal(`SUM(recurringRefundedOriginCount)`), 'recurringRefundedOriginCount'],
      [Sequelize.literal(`SUM(recurringDeclinedOriginCount)`), 'recurringDeclinedOriginCount'],


      ['dateCreated', 'dateCreated'],
      ['campaignId', 'campaignId'],
      ['affId', 'affId'],
    ],
    where: {},
    group: params.group ?? [],
    order: [['dateCreated', 'DESC']],
  };

  if (params.affId) {
    query.where.affId = params.affId;
  }

  if (params.campaignId) {
    query.where.campaignId = params.campaignId;
  }

  if (params.startDate && params.endDate) {
    query.where.dateCreated = {
      [Op.and]: {
        [Op.gte]: params.startDate,
        [Op.lte]: params.endDate
      }
    };
  }
  return query;
};

const getDayStatistic = async function (data) {
  const query = await getQueryDayStatistic({ group: ['dateCreated'] });
  return models.OrderDayStatistic.findAll(query);
};

const getAffsStatisticPaginate = async function ({ affId = [], page = 1, countOnPage = 15 }) {
  const query = await getQueryDayStatistic({ affId, group: ['affId'] });
  return getDayStatisticPaginate(query, page, countOnPage, 'affId');
};

const getAffDayStatistic = async function ({ affId }) {
  const query = await getQueryDayStatistic({ affId, group: ['dateCreated'] });
  return models.OrderDayStatistic.findAll(query);
};

const getAffDayStatisticPagination = async function ({ affId = null, campaignId = null, startDate = null, endDate = null, page = 1, countOnPage = 15 }) {
  const query = await getQueryDayStatistic({ affId, campaignId, startDate, endDate, group: ['dateCreated'] });
  return getDayStatisticPaginate(query, page, countOnPage, 'dateCreated');
};


const getDayStatisticPaginate = function (query, page = 1, countOnPage = 15, groupedColumn) {
  return groupByPaginate(models.OrderDayStatistic, query, page, countOnPage, groupedColumn);
};

const getAffCampaignsStatistic = async function ({ affId, campaignId, startDate = null, endDate = null}) {
  const query = await getQueryDayStatistic({ affId, campaignId,startDate, endDate,  group: ['campaignId']  });
  return models.OrderDayStatistic.findAll(query);
};

/**
 * @param {[Object]} data
 * @return {void}
 */
const importData = async function (data) {
  await models.OrderDayStatistic.bulkCreate(data, {
    fields:['affId','campaignId','totalAmount','rebillsAmount','affRebillsAmount', 'affAmount','referralAmount','companyAmount',
      'newSaleCompleteCount','newSaleCanceledCount','newSaleRefundedCount','newSaleDeclinedCount','recurringCompleteCount',
      'recurringCanceledCount','recurringRefundedCount','recurringDeclinedCount','dateCreated','affOriginAmount','referralOriginAmount','companyOriginAmount',

      'newSaleCompleteOriginCount','newSaleCanceledOriginCount','newSaleRefundedOriginCount','newSaleDeclinedOriginCount',
      'recurringCompleteOriginCount','recurringCanceledOriginCount','recurringRefundedOriginCount','recurringDeclinedOriginCount',
    ],
    updateOnDuplicate: ['affId','campaignId','totalAmount','rebillsAmount','affRebillsAmount', 'affAmount','referralAmount','companyAmount',
      'newSaleCompleteCount','newSaleCanceledCount','newSaleRefundedCount','newSaleDeclinedCount','recurringCompleteCount',
      'recurringCanceledCount','recurringRefundedCount','recurringDeclinedCount','dateCreated','affOriginAmount','referralOriginAmount','companyOriginAmount',

      'newSaleCompleteOriginCount','newSaleCanceledOriginCount','newSaleRefundedOriginCount','newSaleDeclinedOriginCount',
      'recurringCompleteOriginCount','recurringCanceledOriginCount','recurringRefundedOriginCount','recurringDeclinedOriginCount',
    ],
  });
};

module.exports = {
  importData,
  getAffDayStatisticPagination,
  getAffCampaignsStatistic,
  getAffDayStatistic,
  getAffsStatisticPaginate,
  getDayStatistic,

};
