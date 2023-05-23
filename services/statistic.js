const affiliateRepository = require('./../repositories/affiliates');
const affiliateService = require('./../services/affiliate');
const campaignService = require('./../services/campaign');
const campaignRepository = require('./../repositories/campaigns');
const checkoutChampApi = require('./checkout-champ-api');
const userRepository = require('../repositories/user');
const statisticHelper = require('../helpers/statistic');
const orderRepository = require("../repositories/orders");
const orderDayStatisticRepository = require("../repositories/orderDayStatistic");
const errors = require("../core/errors");

const orderService = require("../services/order");

/**
 * @param {int} userId
 * @param {Object} params
 * @return {[object]}
 */
const getUserDayStatistic = async function (userId, params = {}) {
  const user = await userRepository.getUser({
    id:  userId,
    campaigns: true
  });

  const {
    filters = {}
  } = params;

  params = {
    ...params,
    ...filters
  };

  params.affId = user.affiliate.id;


  const result = await orderDayStatisticRepository.getAffDayStatisticPagination(params);
  const totalResult = await orderDayStatisticRepository.getAffCampaignsStatistic(params)

  const total = totalResult[0] ? totalResult : [{
    affOriginAmount: 0,
    affAmount: 0,
    newSaleCompleteCount: 0,
    newSaleCanceledCount: 0,
    newSaleRefundedCount: 0,
    newSaleDeclinedCount: 0,
    recurringCanceledCount: 0,
    recurringRefundedCount: 0,
    recurringDeclinedCount: 0,
    recurringCompleteCount: 0,
    newSaleCompleteOriginCount: 0,
    newSaleCanceledOriginCount: 0,
    newSaleRefundedOriginCount: 0,
    newSaleDeclinedOriginCount: 0,
    recurringCanceledOriginCount: 0,
    recurringRefundedOriginCount: 0,
    recurringDeclinedOriginCount: 0,
    recurringCompleteOriginCount: 0,
  }];

  const totalData = {
    newSubs: 0,
    unSubs: 0,
    rebills: 0,
    sales: 0,
  };

  total.map((total) => {
    totalData.newSubs += total.newSaleCompleteCount;
    totalData.unSubs += (total.newSaleCanceledCount + total.newSaleRefundedCount + total.newSaleDeclinedCount + total.recurringCanceledCount + total.recurringRefundedCount + total.recurringDeclinedCount);
    totalData.rebills += total.recurringCompleteCount;
    totalData.sales += parseInt(total.affAmount);
  });



  return {
    count: result.count,
    data: {
      total: totalData,
      days: result.data.map(day => {
        return {
          date: day.dateCreated,
          newSubs: day.newSaleCompleteCount,
          unSubs: (day.newSaleCanceledCount + day.newSaleRefundedCount + day.newSaleDeclinedCount + day.recurringCanceledCount + day.recurringRefundedCount + day.recurringDeclinedCount),
          rebills: day.recurringCompleteCount,
          sales: parseInt(day.affAmount),
        };
      })
    },
  };
};

/**
 * @param {int} userId
 * @return {[object]}
 */
const getUserCampaignsStatistic = async function (userId) {
  const user = await userRepository.getUser({
    id:  userId,
    campaigns: true
  });
  const params = {
    affId: user.affiliate.id
  };
  const campaigns = await orderDayStatisticRepository.getAffCampaignsStatistic(params);
  return user.campaigns.map(userCamping => {
    const campaign = campaigns.find(campaign => campaign.campaignId === userCamping.id);

    if (campaign) {
      return {
        id: userCamping.id,
        name: userCamping.campaignName,
        income: parseInt(campaign.affAmount),
        rebills: campaign.recurringCompleteCount,
        activeSubs: campaign.newSaleCompleteCount + campaign.recurringCompleteCount,
        purchases: campaign.newSaleCompleteCount + campaign.newSaleCanceledCount +
          campaign.newSaleRefundedCount + campaign.newSaleDeclinedCount +
          campaign.recurringCompleteCount + campaign.recurringCanceledCount +
          campaign.recurringRefundedCount + campaign.recurringDeclinedCount

      };
    } else {
      return {
        id: userCamping.id,
        name: userCamping.campaignName,
        income: 0,
        rebills: 0,
        activeSubs: 0,
        purchases: 0,
      };
    }
  });
};

/**
 * @param {int|null} userId
 * @return {object}
 */
const getUserGeneralStatistic = async function (userId= null) {
  const user = await userRepository.getUser({
    id:  userId,
    campaigns: true,
    referrals: true
  });

  const refIds = user.referrals.map((referral) => {
    return referral.id;
  });

  const referralsTransactions = (await orderDayStatisticRepository.getAffDayStatistic({
    affId: refIds,
  })).map((transaction) => {
    return {
      date: transaction.dateCreated,
      newSubs: transaction.newSaleCompleteCount,
      activeSubs: transaction.newSaleCompleteCount + transaction.recurringCompleteCount,
      unSubs: (transaction.newSaleCanceledCount + transaction.newSaleRefundedCount + transaction.newSaleRefundedCount + transaction.newSaleDeclinedCount + transaction.recurringCanceledCount + transaction.recurringRefundedCount + transaction.recurringDeclinedCount),
      rebills: transaction.recurringCompleteCount,
      balance: transaction.affAmount,
      companyBalance: transaction.companyAmount,
      referralBalance: transaction.referralAmount,
      balanceWithFirstTransaction: transaction.affOriginAmount,
      companyBalanceWithFirstTransaction: transaction.companyOriginAmount,
      referralBalanceWithFirstTransaction: transaction.referralOriginAmount,
    };
  });

  const transactions = (await orderDayStatisticRepository.getAffDayStatistic({
    affId: user.affiliate.id,
  })).map((transaction) => {
    return {
      date: transaction.dateCreated,
      newSubs: transaction.newSaleCompleteCount,
      activeSubs: transaction.newSaleCompleteCount + transaction.recurringCompleteCount,
      unSubs: (transaction.newSaleCanceledCount + transaction.newSaleRefundedCount + transaction.newSaleRefundedCount + transaction.newSaleDeclinedCount + transaction.recurringCanceledCount + transaction.recurringRefundedCount + transaction.recurringDeclinedCount),
      rebills: transaction.recurringCompleteCount,
      balance: transaction.affAmount,
      companyBalance: transaction.companyAmount,
      referralBalance: transaction.referralAmount,
      balanceWithFirstTransaction: 0,
      companyBalanceWithFirstTransaction: 0,
      referralBalanceWithFirstTransaction:0,
    };
  });

  const result = await makeUserGeneralStatistic(transactions);
  const referralResult = await makeUserGeneralStatistic(referralsTransactions);

  return {
    balance: result.balance,
    totalSale: {
      all: parseInt(result.balance.all + referralResult.referralBalance.all),
      today: parseInt(result.balance.today + referralResult.referralBalance.today),
      todayPercents: await statisticHelper.getDifferencePercentsTwoNumbers((result.balance.today + referralResult.referralBalance.today), (result.balance.yesterday + referralResult.referralBalance.yesterday))
    },
    activeSubs: result.activeSubs,
    unSubs: result.unSubs,
    rebillsSuccess: result.rebillsSuccess,
    subsSuccess: result.subsSuccess,
  };
};

/**
 * @param {Object} params
 * @return {[object]}
 */
const getPartnerStatistic = async function (params = {}) {
  const users = (await userRepository.getUsers({
    campaigns: true,
    status: true,
  })).filter((user) => {
    return !!user.affiliate;
  });

  params.affId = users.map(user => {
    return user.affiliate.id;
  });

  const usersResponse = await orderDayStatisticRepository.getAffsStatisticPaginate(params);

  return {
    count: usersResponse.count,
    data: usersResponse.data.map(userResponse => {
      const user = users.find(user => user.affiliate.id === userResponse.affId);

      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        balance: parseInt(userResponse.affAmount),
        referralBalance: parseInt(userResponse.referralAmount),
        balanceWithFirstTransaction: 0,
        referralBalanceWithFirstTransaction: 0,
        status: user.status,
        rebills: userResponse.recurringCompleteCount,
        activeSubs: userResponse.newSaleCompleteCount + userResponse.recurringCompleteCount,
        unSubs: (userResponse.newSaleCanceledCount + userResponse.newSaleRefundedCount +  userResponse.newSaleDeclinedCount + userResponse.recurringCanceledCount + userResponse.recurringRefundedCount + userResponse.recurringDeclinedCount),
        promos: user.campaigns.map(campaign => {
          return {
            id: campaign.id,
            name: campaign.campaignName,
            dateCreated: campaign.dateCreated,
          };
        })
      };
    })
  };
};

/**
 * @param {[objects]} periods
 * @return {[object]}
 */
const makeUserGeneralStatistic = function (periods = []) {
  const checked = {
    balance: {
      yesterday: 0,
      yesterdayWithFirstTransaction: 0,
      weekBefore: 0,
    },
    referralBalance: {
      yesterday: 0,
      weekBefore: 0,
    },
    totalSale: { yesterday: 0 },
    activeSubs: { yesterday: 0 },
    unSubs: { yesterday: 0 },
    rebillsSuccess: {
      yesterday: 0,
      weekBefore: 0,
    },
    subsSuccess: {
      yesterday: 0,
      weekBefore: 0,
    },
  };

  const response = {
    balance: {
      all: 0,
      today: 0,
      week: 0,
      allWithFirstTransaction: 0,
      todayWithFirstTransaction: 0,
      weekWithFirstTransaction: 0,
      todayPercents: 0,
      weekPercents: 0,
      yesterday: 0,
      yesterdayWithFirstTransaction: 0,
    },
    totalSale: {
      all: 0,
      allWithFirstTransaction: 0,
      todayWithFirstTransaction: 0,
      today: 0,
      todayPercents: 0,
    },
    referralBalance: {
      all: 0,
      today: 0,
      week: 0,
      allWithFirstTransaction: 0,
      todayWithFirstTransaction: 0,
      weekWithFirstTransaction: 0,
      todayPercents: 0,
      weekPercents: 0,
      yesterday: 0,
    },
    activeSubs: {
      all: 0,
      today: 0,
      todayPercents: 0,
    },
    unSubs: {
      all: 0,
      today: 0,
      todayPercents: 0,
    },
    rebillsSuccess: {
      all: 0,
      today: 0,
      week: 0,
      todayPercents: 0,
      weekPercents: 0,
      unSubsToday: 0,
      days: {},
      weeks: {},
      months: {},
    },
    subsSuccess: {
      all: 0,
      today: 0,
      week: 0,
      todayPercents: 0,
      weekPercents: 0,
      unSubsToday: 0,
      days: {},
      weeks: {},
      months: {},
    }

  };

  const todayDate = statisticHelper.getDate('today');
  const yesterdayDate = statisticHelper.getDate('yesterday');
  const lastWeekDate = statisticHelper.getDate('lastWeek');
  const beforeLastWeek = statisticHelper.getDate('beforeLastWeek');

  const last30Days = statisticHelper.getLast30Days();
  const last12Weeks = statisticHelper.getLast12Weeks();
  const last12Months = statisticHelper.getLast12Months();

  periods.map(period => {
    last30Days.map(date => {
      if(!response.rebillsSuccess.days[date]){
        response.rebillsSuccess.days[date] = 0;
      }
      if(!response.subsSuccess.days[date]){
        response.subsSuccess.days[date] = 0;
      }
      if(date === period.date){
        response.subsSuccess.days[date] += period.newSubs;
        response.rebillsSuccess.days[date] += period.rebills;
      }
    });

    last12Weeks.map(range => {
      const startDate = range.startDate;
      const endDate = range.endDate;
      const week = `${startDate} - ${endDate}`;

      if(!response.rebillsSuccess.weeks[week]){
        response.rebillsSuccess.weeks[week] = 0;
      }
      if(!response.subsSuccess.weeks[week]){
        response.subsSuccess.weeks[week] = 0;
      }
      if(startDate >= period.date && endDate <= period.date){
        response.subsSuccess.weeks[week] += period.newSubs;
        response.rebillsSuccess.weeks[week] += period.rebills;
      }
    });

    last12Months.map(range => {
      const startDate = range.startDate;
      const endDate = range.endDate;
      const month = startDate.slice(0, -3);

      if(!response.rebillsSuccess.months[month]){
        response.rebillsSuccess.months[month] = 0;
      }
      if(!response.subsSuccess.months[month]){
        response.subsSuccess.months[month] = 0;
      }
      if(startDate <= period.date && endDate >= period.date){
        response.subsSuccess.months[month] += period.newSubs;
        response.rebillsSuccess.months[month] += period.rebills;
      }
    });

    response.balance.allWithFirstTransaction += period.balanceWithFirstTransaction;
    response.totalSale.allWithFirstTransaction += period.balanceWithFirstTransaction + period.referralBalanceWithFirstTransaction;
    response.referralBalance.allWithFirstTransaction += period.referralBalanceWithFirstTransaction;

    response.balance.all += period.balance;
    response.totalSale.all += period.balance + period.referralBalance;

    response.referralBalance.all += period.referralBalance;

    response.unSubs.all += period.unSubs;
    response.rebillsSuccess.all += period.rebills;
    response.subsSuccess.all += period.newSubs;
    response.activeSubs.all += period.activeSubs;

    if(period.date === todayDate){
      response.balance.todayWithFirstTransaction += period.balanceWithFirstTransaction;
      response.totalSale.todayWithFirstTransaction += period.balanceWithFirstTransaction + period.referralBalanceWithFirstTransaction;
      response.referralBalance.todayWithFirstTransaction += period.referralBalanceWithFirstTransaction;

      response.balance.today += period.balance;
      response.totalSale.today += period.balance + period.referralBalance;
      response.referralBalance.today += period.referralBalance;
      response.unSubs.today += period.unSubs;
      response.rebillsSuccess.today += period.rebills;
      response.subsSuccess.today += period.newSubs;
      response.activeSubs.today += period.activeSubs;
    }

    if(period.date > lastWeekDate){
      response.balance.week += period.balance;
      response.referralBalance.week += parseInt(period.referralBalance);

      response.balance.weekWithFirstTransaction += period.balanceWithFirstTransaction;
      response.referralBalance.weekWithFirstTransaction += parseInt(period.referralBalanceWithFirstTransaction);

      response.rebillsSuccess.week += period.rebills;
      response.subsSuccess.week += period.newSubs;
    }

    if(period.date === yesterdayDate){
      checked.balance.yesterday += period.balance;
      checked.balance.yesterdayWithFirstTransaction += period.balanceWithFirstTransaction;
      checked.totalSale.yesterday += period.balance + period.referralBalance;
      checked.referralBalance.yesterday += period.referralBalance;
      checked.unSubs.yesterday += period.unSubs;
      checked.rebillsSuccess.yesterday += period.rebills;
      checked.subsSuccess.yesterday += period.newSubs;
      checked.activeSubs.yesterday += period.activeSubs;
    }

    if(period.date < lastWeekDate && period.date > beforeLastWeek){
      checked.balance.weekBefore += period.balance;
      checked.referralBalance.weekBefore += period.referralBalance;
      checked.rebillsSuccess.weekBefore += period.rebills;
      checked.subsSuccess.weekBefore += period.newSubs;
    }
  });

  response.balance.todayPercents = statisticHelper.getDifferencePercentsTwoNumbers(response.balance.today, checked.balance.yesterday);
  response.balance.weekPercents = statisticHelper.getDifferencePercentsTwoNumbers(response.balance.week, checked.balance.weekBefore);

  response.referralBalance.todayPercents = statisticHelper.getDifferencePercentsTwoNumbers(response.referralBalance.today, checked.referralBalance.yesterday);
  response.referralBalance.weekPercents = statisticHelper.getDifferencePercentsTwoNumbers(response.referralBalance.week, checked.referralBalance.weekBefore);

  response.totalSale.todayPercents = statisticHelper.getDifferencePercentsTwoNumbers(response.totalSale.today, checked.totalSale.yesterday);
  response.activeSubs.todayPercents = statisticHelper.getDifferencePercentsTwoNumbers(response.activeSubs.today, checked.activeSubs.yesterday);
  response.unSubs.todayPercents = statisticHelper.getDifferencePercentsTwoNumbers(response.unSubs.today, checked.unSubs.yesterday);

  response.rebillsSuccess.todayPercents = statisticHelper.getDifferencePercentsTwoNumbers(response.rebillsSuccess.today, checked.rebillsSuccess.yesterday);
  response.rebillsSuccess.weekPercents = statisticHelper.getDifferencePercentsTwoNumbers(response.rebillsSuccess.week, checked.rebillsSuccess.weekBefore);

  response.subsSuccess.todayPercents = statisticHelper.getDifferencePercentsTwoNumbers(response.subsSuccess.today, checked.subsSuccess.yesterday);
  response.subsSuccess.weekPercents = statisticHelper.getDifferencePercentsTwoNumbers(response.subsSuccess.week, checked.subsSuccess.weekBefore);

  if(response.rebillsSuccess.today - response.unSubs.today){
    response.subsSuccess.unSubsToday = response.unSubs.today/(response.subsSuccess.today + response.unSubs.today)*100;
    response.rebillsSuccess.unSubsToday = response.unSubs.today/(response.rebillsSuccess.today + response.unSubs.today)*100;
  }

  response.balance.all = parseInt(response.balance.all);
  response.balance.yesterday = parseInt(checked.balance.yesterday);
  response.totalSale.all = parseInt(response.totalSale.all);
  response.totalSale.today = parseInt(response.totalSale.today);
  response.referralBalance.all = parseInt(response.referralBalance.all);
  response.balance.week = parseInt(response.balance.week);
  response.balance.today = parseInt(response.balance.today);

  response.balance.allWithFirstTransaction = parseInt(response.balance.allWithFirstTransaction);
  response.balance.yesterdayWithFirstTransaction = parseInt(checked.balance.yesterdayWithFirstTransaction);
  response.totalSale.allWithFirstTransaction = parseInt(response.totalSale.allWithFirstTransaction);
  response.totalSale.todayWithFirstTransaction = parseInt(response.totalSale.todayWithFirstTransaction);
  response.referralBalance.allWithFirstTransaction = parseInt(response.referralBalance.allWithFirstTransaction);
  response.balance.weekWithFirstTransaction = parseInt(response.balance.weekWithFirstTransaction);
  response.balance.todayWithFirstTransaction = parseInt(response.balance.todayWithFirstTransaction);

  response.subsSuccess.unSubsToday = parseInt(response.subsSuccess.unSubsToday);
  response.rebillsSuccess.unSubsToday = parseInt(response.rebillsSuccess.unSubsToday);
  return response;
};

/**
 * @param {int|null} userId
 * @return {object}
 */
const getAdminUserGeneralStatistic = async function (userId = null) {

  const user = await userRepository.getUser({
    id:  userId,
    campaigns: true,
    referrals: true,
    status: true
  });

  const refIds = user.referrals.map((referral) => {
    return referral.id;
  });

  const referralsTransactions = (await orderDayStatisticRepository.getAffDayStatistic({
    affId: refIds,
  })).map((transaction) => {
    return {
      date: transaction.dateCreated,
      newSubs: transaction.newSaleCompleteCount,
      activeSubs: transaction.newSaleCompleteCount + transaction.recurringCompleteCount,
      unSubs: (transaction.newSaleCanceledCount + transaction.newSaleRefundedCount + transaction.newSaleDeclinedCount + transaction.recurringCanceledCount + transaction.recurringRefundedCount + transaction.recurringDeclinedCount),
      rebills: transaction.recurringCompleteCount,
      balance: transaction.affAmount,
      companyBalance: transaction.companyAmount,
      referralBalance: transaction.referralAmount,
      balanceWithFirstTransaction: transaction.affOriginAmount,
      companyBalanceWithFirstTransaction: transaction.companyOriginAmount,
      referralBalanceWithFirstTransaction: transaction.referralOriginAmount,
    };
  });

  const transactions = (await orderDayStatisticRepository.getAffDayStatistic({
    affId: user.affiliate.id,
  })).map((transaction) => {
    return {
      date: transaction.dateCreated,
      newSubs: transaction.newSaleCompleteCount,
      activeSubs: transaction.newSaleCompleteCount + transaction.recurringCompleteCount,
      unSubs: (transaction.newSaleCanceledCount + transaction.newSaleRefundedCount + transaction.newSaleDeclinedCount + transaction.recurringCanceledCount + transaction.recurringRefundedCount + transaction.recurringDeclinedCount),
      rebills: transaction.recurringCompleteCount,
      balance: transaction.affAmount,
      companyBalance: transaction.companyAmount,
      referralBalance: transaction.referralAmount,
      balanceWithFirstTransaction: 0,
      companyBalanceWithFirstTransaction: 0,
      referralBalanceWithFirstTransaction:0,
    };
  });

  const result = await makeUserGeneralStatistic(transactions);
  const referralResult = await makeUserGeneralStatistic(referralsTransactions);
  const promosPromise = await getUserCampaignsStatistic(user.id);

  return {
    balance: result.balance,
    totalSale: {
      all: parseInt(result.balance.all + referralResult.referralBalance.all),
      today: parseInt(result.balance.today + referralResult.referralBalance.today),
      todayPercents: await statisticHelper.getDifferencePercentsTwoNumbers((result.balance.today + referralResult.referralBalance.today), (result.balance.yesterday + referralResult.referralBalance.yesterday))
    },
    activeSubs: result.activeSubs,
    unSubs: result.unSubs,
    rebillsSuccess: result.rebillsSuccess,
    subsSuccess: result.subsSuccess,
    promos: promosPromise,
  };
};

/**
 * @return {object}
 */
const getGeneralStatistic = async function () {
  const campaignsPromise = campaignRepository.count();
  const dayStatPromise = orderDayStatisticRepository.getDayStatistic();

  const result = await Promise.all([campaignsPromise,dayStatPromise]);
  const [
    campaigns,
    dayStat,
  ] = result;

  let totalEarned = 0;
  let activeSubs = 0;
  dayStat.map(day => {
    totalEarned += day.companyOriginAmount;
    activeSubs += day.newSaleCompleteCount + day.recurringCompleteCount;
  });

  return {
    activeSubs,
    promos: campaigns,
    totalEarned: parseInt(totalEarned),
    traffic: 0,
  };
};

/**
 * @param {integer} userId
 * @param {int} campaignId
 * @param {object} params
 * @return {[object]}
 */
const getCampaignDaysStatistic = async function (userId, campaignId, params) {
  const user = await userRepository.getUser({
    id: userId,
    campaigns: true
  });
  const campaign = user.campaigns.find(campaign => { return parseInt(campaign.id) === parseInt(campaignId); });
  if(!campaign){
      throw new errors.RepositoryModelNotFound();
  }
  const filter = params.filters ?? {};
  const updatedParams  = {
    campaignId: campaign.id,
    affId: user.affiliate.id,
    countOnPage: params.countOnPage,
    page: params.page,
    ...filter
  };


  const result = await orderDayStatisticRepository.getAffDayStatisticPagination(updatedParams);
  const total = (await orderDayStatisticRepository.getAffCampaignsStatistic(updatedParams))[0] ?? {
    affOriginAmount: 0,
    affAmount: 0,
    newSaleCompleteCount: 0,
    newSaleCanceledCount: 0,
    newSaleRefundedCount: 0,
    newSaleDeclinedCount: 0,
    recurringCanceledCount: 0,
    recurringRefundedCount: 0,
    recurringDeclinedCount: 0,
    recurringCompleteCount: 0,
    newSaleCompleteOriginCount: 0,
    newSaleCanceledOriginCount: 0,
    newSaleRefundedOriginCount: 0,
    newSaleDeclinedOriginCount: 0,
    recurringCanceledOriginCount: 0,
    recurringRefundedOriginCount: 0,
    recurringDeclinedOriginCount: 0,
    recurringCompleteOriginCount: 0,
  };

  const originData = [];
  const effectedData = [];
  const effectedTotalData = {
    originSales: parseInt(total.affOriginAmount),
    effectedSales: parseInt(total.affAmount),
    newSubs: total.newSaleCompleteCount,
    unSubs: (total.newSaleCanceledCount + total.newSaleRefundedCount +  total.newSaleDeclinedCount + total.recurringCanceledCount + total.recurringRefundedCount + total.recurringDeclinedCount),
    rebills: total.recurringCompleteCount,
  };
  const originTotalData = {
    originSales:  parseInt(total.affOriginAmount),
    effectedSales:  parseInt(total.affAmount),
    newSubs: total.newSaleCompleteOriginCount,
    unSubs: (total.newSaleCanceledOriginCount + total.newSaleRefundedOriginCount +  total.newSaleDeclinedOriginCount + total.recurringCanceledOriginCount + total.recurringRefundedOriginCount + total.recurringDeclinedOriginCount),
    rebills: total.recurringCompleteOriginCount,
  };

  result.data.map(dayData => {

    effectedData.push({
      originSales:  parseInt(dayData.affOriginAmount),
      effectedSales:  parseInt(dayData.affAmount),

      newSubs: dayData.newSaleCompleteCount,
      unSubs: (dayData.newSaleCanceledCount + dayData.newSaleRefundedCount +  dayData.newSaleDeclinedCount + dayData.recurringCanceledCount + dayData.recurringRefundedCount + dayData.recurringDeclinedCount),
      rebills: dayData.recurringCompleteCount,
      date: dayData.dateCreated,
      conversion: 100,
    });

    originData.push({
      originSales:  parseInt(dayData.affOriginAmount),
      effectedSales:  parseInt(dayData.affAmount),

      newSubs: dayData.newSaleCompleteOriginCount,
      unSubs: (dayData.newSaleCanceledOriginCount + dayData.newSaleRefundedOriginCount +  dayData.newSaleDeclinedOriginCount + dayData.recurringCanceledOriginCount + dayData.recurringRefundedOriginCount + dayData.recurringDeclinedOriginCount),
      rebills: dayData.recurringCompleteOriginCount,
      date: dayData.dateCreated,
      conversion: 100,
    });

    return {

    };
  });

  return {
    count: result.count,
    data: {
      origin: {
        total: originTotalData,
        days: originData
      },
      effected:{
        total: effectedTotalData,
        days: effectedData
      }
    },
  };
};

/**
 * @return {void}
 */
const loadStatistic = async function () {
  const args = {
    page: 1,
    resultsPerPage: 1000
  }

  const affiliates = await affiliateRepository.getAffiliates({ user: true });
  const campaigns = await campaignRepository.getMany();

  const { count } =  await orderRepository.paginate({}, args.page, args.resultsPerPage);
  const paginationResult = checkoutChampApi.pagination(count, args.resultsPerPage);

  const days = {};
  const dayOrders = [];
  const userShave = {};

  for (let currentPage = args.page; currentPage <= paginationResult.countAllPages; currentPage++) {
      const { rows } = await orderRepository.paginate({}, currentPage, args.resultsPerPage);

      rows.map(order => {
        let affiliate = affiliates.find(affiliate => affiliate.id === order.affId);
        let campaign = campaigns.find(campaign => campaign.id === order.campaignId);

        if(!affiliate || !campaign){
          return false;
        }


        if(!days[order.dateCreated]){
          days[order.dateCreated] = {};
        }

        if(!days[order.dateCreated][affiliate.id]){
          days[order.dateCreated][affiliate.id] = {};
        }
        if(!days[order.dateCreated][affiliate.id][campaign.id]){
          days[order.dateCreated][affiliate.id][campaign.id] = {
            affId: affiliate.id,
            campaignId: campaign.id,
            dateCreated: order.dateCreated,
            totalAmount: 0,
            rebillsAmount: 0,
            affRebillsAmount: 0,
            affAmount: 0,
            referralAmount: 0,
            companyAmount: 0,
            affOriginAmount: 0,
            referralOriginAmount: 0,
            companyOriginAmount: 0,
            newSaleCompleteCount: 0,
            newSaleCanceledCount: 0,
            newSaleRefundedCount: 0,
            newSaleDeclinedCount: 0,
            recurringCompleteCount: 0,
            recurringCanceledCount: 0,
            recurringRefundedCount: 0,
            recurringDeclinedCount: 0,

            newSaleCompleteOriginCount: 0,
            newSaleCanceledOriginCount: 0,
            newSaleRefundedOriginCount: 0,
            newSaleDeclinedOriginCount: 0,
            recurringCompleteOriginCount: 0,
            recurringCanceledOriginCount: 0,
            recurringRefundedOriginCount: 0,
            recurringDeclinedOriginCount: 0,
          };
        }

        if(!userShave[order.dateCreated]){
          userShave[order.dateCreated] = {};
        }

        if(!userShave[order.dateCreated][affiliate.id]){
          userShave[order.dateCreated][affiliate.id] = {
            newCount: 0,
            recurringCount: 0,
            saveNewSaleCount: 0,
            saveRecurringCount: 0,
          };
        }

        if(order.orderStatus === 'COMPLETE'){
          days[order.dateCreated][affiliate.id][campaign.id].totalAmount += Number(order.totalAmount);

          if( order.orderType === 'RECURRING'){
            days[order.dateCreated][affiliate.id][campaign.id].rebillsAmount += Number(order.totalAmount);

            if(affiliate.user){
              if(affiliate.user.referralParentId){
                days[order.dateCreated][affiliate.id][campaign.id].affRebillsAmount += (Number(order.totalAmount) * (affiliate.user.salaryPercent - affiliate.user.referralPercent))/100;
              }
            }
          }

          if(affiliate.user){
            if(order.orderType === 'NEW_SALE' && !affiliate.user.checkFirstTransaction){
              if(affiliate.user.referralParentId) {
                days[order.dateCreated][affiliate.id][campaign.id].affAmount += 0;
                days[order.dateCreated][affiliate.id][campaign.id].referralAmount += 0;
              } else {
                days[order.dateCreated][affiliate.id][campaign.id].affAmount += 0;
              }
              days[order.dateCreated][affiliate.id][campaign.id].companyAmount += 0;
            } else {
              if(affiliate.user.referralParentId) {
                days[order.dateCreated][affiliate.id][campaign.id].affAmount += (Number(order.totalAmount) * (affiliate.user.salaryPercent - affiliate.user.referralPercent))/100;
                days[order.dateCreated][affiliate.id][campaign.id].referralAmount += (Number(order.totalAmount) * (affiliate.user.referralPercent))/100;
              } else {
                days[order.dateCreated][affiliate.id][campaign.id].affAmount += (Number(order.totalAmount) * (affiliate.user.salaryPercent))/100;
              }
              days[order.dateCreated][affiliate.id][campaign.id].companyAmount += (Number(order.totalAmount) * (100 - affiliate.user.salaryPercent))/100;
            }
            if(affiliate.user.referralParentId) {
              days[order.dateCreated][affiliate.id][campaign.id].affOriginAmount += (Number(order.totalAmount) * (affiliate.user.salaryPercent - affiliate.user.referralPercent))/100;
              days[order.dateCreated][affiliate.id][campaign.id].referralOriginAmount += (Number(order.totalAmount) * (affiliate.user.referralPercent))/100;
            } else {
              days[order.dateCreated][affiliate.id][campaign.id].affOriginAmount += (Number(order.totalAmount) * (affiliate.user.salaryPercent))/100;
            }
            days[order.dateCreated][affiliate.id][campaign.id].companyOriginAmount += (Number(order.totalAmount) * (100 - affiliate.user.salaryPercent))/100;
          }
        }

        if(order.orderStatus === 'COMPLETE'){
          if(order.orderType === 'NEW_SALE'){
            //Shave
            userShave[order.dateCreated][affiliate.id].newCount += 1;

            days[order.dateCreated][affiliate.id][campaign.id].newSaleCompleteCount += 1;
            days[order.dateCreated][affiliate.id][campaign.id].newSaleCompleteOriginCount += 1;

          }
          if(order.orderType === 'RECURRING'){
            //Shave
            userShave[order.dateCreated][affiliate.id].recurringCount += 1;

            days[order.dateCreated][affiliate.id][campaign.id].recurringCompleteCount += 1;
            days[order.dateCreated][affiliate.id][campaign.id].recurringCompleteOriginCount += 1;
          }
        }

        if(order.orderStatus === 'CANCELLED'){
          if(order.orderType === 'NEW_SALE'){
            days[order.dateCreated][affiliate.id][campaign.id].newSaleCanceledCount += 1;
            days[order.dateCreated][affiliate.id][campaign.id].newSaleCanceledOriginCount += 1;

          }
          if(order.orderType === 'RECURRING'){
            days[order.dateCreated][affiliate.id][campaign.id].recurringCanceledCount += 1;
            days[order.dateCreated][affiliate.id][campaign.id].recurringCanceledOriginCount += 1;
          }
        }

        if(order.orderStatus === 'DECLINED'){
          if(order.orderType === 'NEW_SALE'){
            days[order.dateCreated][affiliate.id][campaign.id].newSaleDeclinedCount += 1;
            days[order.dateCreated][affiliate.id][campaign.id].newSaleDeclinedOriginCount += 1;

          }
          if(order.orderType === 'RECURRING'){
            days[order.dateCreated][affiliate.id][campaign.id].recurringDeclinedCount += 1;
            days[order.dateCreated][affiliate.id][campaign.id].recurringDeclinedOriginCount += 1;

          }
        }

        if(order.orderStatus === 'REFUNDED'){
          if(order.orderType === 'NEW_SALE'){
            days[order.dateCreated][affiliate.id][campaign.id].newSaleRefundedOriginCount += 1;
            days[order.dateCreated][affiliate.id][campaign.id].newSaleRefundedCount += 1;
          }
          if(order.orderType === 'RECURRING'){
            days[order.dateCreated][affiliate.id][campaign.id].recurringRefundedCount += 1;
            days[order.dateCreated][affiliate.id][campaign.id].recurringRefundedOriginCount += 1;

          }
        }
      });
  }

  Object.keys(days).map(function(key, index) {
    Object.keys(days[key]).map(function(key2, index) {
      Object.keys(days[key][key2]).map(function(key3, index) {
        const affiliate = affiliates.find(affiliate => affiliate.id === days[key][key2][key3].affId);

        //Shave
        if(userShave[key][key2] && affiliate.user && affiliate.user.shavePercent){
          const newSaleCompleteCount = Math.round(((days[key][key2][key3].newSaleCompleteCount * affiliate.user.shavePercent)/100));
          const recurringCompleteCount = Math.round(((days[key][key2][key3].recurringCompleteCount * affiliate.user.shavePercent)/100));

          days[key][key2][key3].newSaleCompleteCount -= newSaleCompleteCount;
          days[key][key2][key3].recurringCompleteCount -= recurringCompleteCount;
          days[key][key2][key3].newSaleCanceledCount += newSaleCompleteCount;
          days[key][key2][key3].recurringCanceledCount += recurringCompleteCount;

          if(days[key][key2][key3].affAmount){
            days[key][key2][key3].affAmount -= (days[key][key2][key3].affAmount * affiliate.user.shavePercent)/100;
            days[key][key2][key3].companyAmount -= (days[key][key2][key3].affAmount * affiliate.user.shavePercent)/100;

            if((days[key][key2][key3].newSaleCompleteCount === 0 || !affiliate.user.checkFirstTransaction) && days[key][key2][key3].recurringCompleteCount === 0 ){
              days[key][key2][key3].affAmount = 0;
              days[key][key2][key3].companyAmount = 0;
            }
          }
        }
        dayOrders.push(days[key][key2][key3]);
      });
    });
  });
  orderDayStatisticRepository.importData(dayOrders);
};

/**
 * @param {Object} args
 * @return {void}
 */
const loadAll = async function (args = {
  startDate: '04/09/2000',
  endDate: '03/22/3000'
}){
  console.info(`Start load statistic with startDate: ${args.startDate} and endDate: ${args.endDate}`);
  console.info('Start load campaigns...');
  await campaignService.loadCampaigns();
  console.info('End load campaigns');
  console.info('Start load affiliates...');
  await affiliateService.loadAffiliates();
  console.info('End load affiliates');
  console.info('Start load orders...');
  await orderService.loadOrders(args);
  console.info('End load orders');
  console.info('Start reload orders...');
  await loadStatistic();
  console.info(`End load statistic`);
};

module.exports = {
  getUserDayStatistic,
  getUserCampaignsStatistic,
  getUserGeneralStatistic,
  getAdminUserGeneralStatistic,
  getGeneralStatistic,
  getCampaignDaysStatistic,
  getPartnerStatistic,
  loadAll,
  makeUserGeneralStatistic
};
