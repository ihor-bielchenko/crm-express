const models = require('../models');
const baseRepository = require('../repositories');
const Sequelize = require('sequelize');
const fileHelper = require("../helpers/file");
const {SERVER_URL} = require("../consts");
const userRolesEnum = require("../enums/userRoles");
const userVerifyStatusesEnum = require("../enums/userVerifyStatuses");
const Op = require('sequelize').Op;

/**
 * @param {object} params
 * @return {object}
 */
const getDaysStatQuery = function (params = {}) {
	const totalAmountLiteral = `SUM(CASE WHEN (responseType = 'SUCCESS' AND (billingCycleNumber != 1 OR (billingCycleNumber = 1 AND Transaction.checkFirstTransaction = 1))) THEN totalAmount ELSE '0' END)`;
	const balanceLiteral  =`(${totalAmountLiteral} * CASE WHEN \`campaign->affiliate->user\`.\`referralParentId\` IS NULL THEN (Transaction.salaryPercent)/100 ELSE (Transaction.salaryPercent - Transaction.referralPercent)/100 END)`;
	const referralBalanceLiteral  =`(${totalAmountLiteral} * Transaction.referralPercent)/100`;
	const companyBalanceLiteral  =`(${totalAmountLiteral} * (100 - Transaction.salaryPercent))/100`;

	const totalAmountLiteralWithFirstTransaction = `SUM(CASE WHEN responseType = 'SUCCESS' THEN totalAmount ELSE '0' END)`;
	const balanceLiteralWithFirstTransaction   =`(${totalAmountLiteralWithFirstTransaction} * CASE WHEN \`campaign->affiliate->user\`.\`referralParentId\` IS NULL THEN (Transaction.salaryPercent)/100 ELSE (Transaction.salaryPercent - Transaction.referralPercent)/100 END)`;
	const referralBalanceLiteralWithFirstTransaction   =`(${totalAmountLiteralWithFirstTransaction} * Transaction.referralPercent)/100`;
	const companyBalanceLiteralWithFirstTransaction   =`(${totalAmountLiteralWithFirstTransaction} * (100 - Transaction.salaryPercent))/100`;


	const query = {
		attributes: [
			[Sequelize.literal(totalAmountLiteral), 'totalAmount'],
			[Sequelize.literal(balanceLiteral), 'balance'],
			[Sequelize.literal(referralBalanceLiteral), 'referralBalance'],
			[Sequelize.literal(companyBalanceLiteral), 'companyBalance'],


			[Sequelize.literal(balanceLiteralWithFirstTransaction), 'balanceWithFirstTransaction'],
			[Sequelize.literal(referralBalanceLiteralWithFirstTransaction), 'referralBalanceWithFirstTransaction'],
			[Sequelize.literal(companyBalanceLiteralWithFirstTransaction), 'companyBalanceWithFirstTransaction'],



			[Sequelize.literal(`COUNT(DISTINCT(CASE WHEN (billingCycleNumber = 1 AND responseType = 'SUCCESS') THEN clientOrderId END))`), 'newSubs'],
			// [Sequelize.literal(`SUM(CASE WHEN (billingCycleNumber = 1 AND responseType = 'SUCCESS') THEN 1 ELSE 0 END)`), 'newSubs'],
			[Sequelize.literal(`SUM(CASE WHEN (responseType = 'HARD_DECLINE') THEN 1 ELSE 0 END)`), 'unSubs'],
			[Sequelize.literal(`SUM(CASE WHEN (billingCycleNumber > 1 AND responseType = 'SUCCESS' AND totalAmount > 0) THEN 1 ELSE 0 END)`), 'rebills'],
			[Sequelize.literal(`COUNT(DISTINCT(CASE WHEN responseType='SUCCESS' THEN orderId END))`), 'purchases'],
			[Sequelize.literal(`50`), 'salaryPercent'],
			[Sequelize.literal(`10`), 'referralPercent'],
			[Sequelize.fn('DATE_FORMAT', Sequelize.col('Transaction.dateCreated'),'%Y-%m-%d'), 'date'],
		],
		include: [
			{
				model: models.Campaign,
				as: 'campaign',
				required: true,
				duplicating: false,
				include: [
					{
						model: models.Affiliate,
						as: 'affiliate',
						require: true,
						duplicating: false,
						include: [
							{
								model: models.User,
								as: 'user',
								required: true,
								duplicating: false,
								include: [
									{
										model: models.UserStatus,
										as: 'status',
									},
								],
							},
						],
					},
				],
			},
		],
		where: [
			Sequelize.where(Sequelize.col('Transaction.affId'), Op.eq, Sequelize.col('campaign.affiliate.id')),
		],
		group: [Sequelize.col('date')],
		raw: true,
		having: {}
	};

	if (params.userId) {
		query.where.push(Sequelize.where(Sequelize.col('campaign.affiliate.user.id'), Op.eq, params.userId));
	}

	if (params.filters && params.filters.campaignId) {
		query.where.push(Sequelize.where(Sequelize.col('campaign.id'), Op.eq, params.filters.campaignId));
	}

	if (params.campaignId) {
		query.where.push(Sequelize.where(Sequelize.col('campaign.id'), Op.eq, params.campaignId));
	}

	if(params.referralParentId){
		query.where.push(Sequelize.where(Sequelize.col('campaign.affiliate.user.referralParentId'), Op.eq, params.referralParentId));
	}

	if (params.filters && params.filters.startDate && params.filters.endDate) {
		query.where.push(Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('Transaction.dateCreated'),'%Y-%m-%d'), '>=', params.filters.startDate));
		query.where.push(Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('Transaction.dateCreated'),'%Y-%m-%d'), '<=', params.filters.endDate));
	}
	return query;
};

/**
 * @param {object} params
 * @return {object}
 */
const getDaysStat = async function (params = {}) {
	const query = getDaysStatQuery(params);
	const transactions = await models.Transaction.findAll(query);
	const activeSubsResult = await getDaysActiveSubs(params);
	return transactions.map(transaction => {
		const activeSubs = activeSubsResult.find(day => day.date === transaction['date']);
		return {
			date: transaction['date'],
			newSubs: transaction['newSubs'] ? transaction['newSubs'] : 0,
			activeSubs: activeSubs ? activeSubs.count : 0,
			unSubs: transaction['unSubs'] ? transaction['unSubs'] : 0,
			rebills: transaction['rebills'] ? transaction['rebills'] : 0,
			balance: transaction['balance'] ? transaction['balance'] : 0,
			companyBalance: transaction['companyBalance'] ? transaction['companyBalance'] : 0,
			referralBalance: transaction['referralBalance'] ? transaction['referralBalance'] : 0,

			balanceWithFirstTransaction: transaction['balanceWithFirstTransaction'] ? transaction['balanceWithFirstTransaction'] : 0,
			companyBalanceWithFirstTransaction: transaction['companyBalanceWithFirstTransaction'] ? transaction['companyBalanceWithFirstTransaction'] : 0,
			referralBalanceWithFirstTransaction: transaction['referralBalanceWithFirstTransaction'] ? transaction['referralBalanceWithFirstTransaction'] : 0,
		};
	});
};

/**
 * @param {object} params
 * @return {object}
 */
const getDaysStatPagination = async function (params = {}) {
	const query = getDaysStatQuery(params);
	const transactions = await baseRepository.groupByPaginate(models.Transaction, query, params.page, params.countOnPage,'dateCreated');

	const activeSubsResult = await getDaysActiveSubs(params);
	return {
		count: transactions.count,
		data: transactions.data.map(transaction => {
			const activeSubs = activeSubsResult.find(day => day.date === transaction['date']);
			return {
				date: transaction['date'],
				newSubs: transaction['newSubs'] ? transaction['newSubs'] : 0,
				activeSubs: activeSubs ? activeSubs.count : 0,
				unSubs: transaction['unSubs'] ? transaction['unSubs'] : 0,
				rebills: transaction['rebills'] ? transaction['rebills'] : 0,
				balance: transaction['balance'] ? transaction['balance'] : 0,
				referralBalance: transaction['referralBalance'],

				balanceWithFirstTransaction: transaction['balanceWithFirstTransaction'] ? transaction['balanceWithFirstTransaction'] : 0,
				companyBalanceWithFirstTransaction: transaction['companyBalanceWithFirstTransaction'] ? transaction['companyBalanceWithFirstTransaction'] : 0,
				referralBalanceWithFirstTransaction: transaction['referralBalanceWithFirstTransaction'] ? transaction['referralBalanceWithFirstTransaction'] : 0
			};
		}),
	};
};
/**
 * @param {object} params
 * @return {object}
 */
const  getCampaignsStat = async function (params = {}) {
	const totalAmountLiteral = `SUM(CASE WHEN (responseType = 'SUCCESS' AND (billingCycleNumber != 1 OR (billingCycleNumber = 1 AND transactions.checkFirstTransaction = 1))) THEN totalAmount ELSE '0' END)`;
	const balanceLiteral  =`(${totalAmountLiteral} * CASE WHEN \`affiliate->user\`.\`referralParentId\` IS NULL THEN (transactions.salaryPercent)/100 ELSE (transactions.salaryPercent - transactions.referralPercent)/100 END)`;
	const referralBalanceLiteral  =`(${totalAmountLiteral} * transactions.referralPercent)/100`;
	const companyBalanceLiteral  =`(${totalAmountLiteral} * (100 - transactions.salaryPercent))/100`;

	const totalAmountLiteralWithFirstTransaction = `SUM(CASE WHEN responseType = 'SUCCESS' THEN totalAmount ELSE '0' END)`;
	const balanceLiteralWithFirstTransaction  =`(${totalAmountLiteralWithFirstTransaction} * CASE WHEN \`affiliate->user\`.\`referralParentId\` IS NULL THEN (transactions.salaryPercent)/100 ELSE (transactions.salaryPercent - transactions.referralPercent)/100 END)`;
	const referralBalanceLiteralWithFirstTransaction  =`(${totalAmountLiteralWithFirstTransaction} * transactions.referralPercent)/100`;
	const companyBalanceLiteralWithFirstTransaction  =`(${totalAmountLiteralWithFirstTransaction} * (100 - transactions.salaryPercent))/100`;

	const query = {
		include: [
			{
				model: models.Affiliate,
				as: 'affiliate',
				required: true,
				duplicating: false,
				include: [
					{
						model: models.User,
						as: 'user',
						required: true,
						duplicating: false,
						where: {},
					},
				],
			},
			{
				attributes:[
					[Sequelize.literal(totalAmountLiteral), 'totalAmount'],
					[Sequelize.literal(balanceLiteral), 'balance'],
					[Sequelize.literal(referralBalanceLiteral), 'referralBalance'],
					[Sequelize.literal(companyBalanceLiteral), 'companyBalance'],

					[Sequelize.literal(balanceLiteralWithFirstTransaction), 'balanceWithFirstTransaction'],
					[Sequelize.literal(referralBalanceLiteralWithFirstTransaction), 'referralBalanceWithFirstTransaction'],
					[Sequelize.literal(companyBalanceLiteralWithFirstTransaction), 'companyBalanceWithFirstTransaction'],


					// [Sequelize.literal(`SUM(CASE WHEN (billingCycleNumber = 1 AND responseType = 'SUCCESS') THEN 1 ELSE 0 END)`), 'newSubs'],
					[Sequelize.literal(`COUNT(DISTINCT(CASE WHEN (billingCycleNumber = 1 AND responseType = 'SUCCESS') THEN clientOrderId END))`), 'newSubs'],
					[Sequelize.literal(`SUM(CASE WHEN (responseType = 'HARD_DECLINE') THEN 1 ELSE 0 END)`), 'unSubs'],
					[Sequelize.literal(`SUM(CASE WHEN (billingCycleNumber > 1 AND responseType = 'SUCCESS' AND totalAmount > 0) THEN 1 ELSE 0 END)`), 'rebills'],
					[Sequelize.literal(`COUNT(DISTINCT(CASE WHEN responseType='SUCCESS' THEN orderId END))`), 'purchases'],
					['salaryPercent', 'salaryPercent'],
					['referralPercent', 'referralPercent'],
				],
				model: models.Transaction,
				as: 'transactions',
				required: false,
				duplicating: false,
				where: [
					Sequelize.where(Sequelize.col('affiliate.id'), Op.eq, Sequelize.col('transactions.affId')),
				],
			}
		],
		group: [Sequelize.col('id')],
		raw: true,
	};

	if(params.userId){
		query.include[0].include[0].where.id = params.userId;
	}

	const campaigns = await models.Campaign.findAll(query);
	const activeSubsResult = await getCampaignActiveSubs(params);
	return campaigns.map(campaign => {
		const activeSubs = activeSubsResult.find(day => day.id === campaign['id']);
		return {
				id: campaign['id'],
				name: campaign['campaignName'],
				dateCreated: campaign['dateCreated'],
				income: campaign['transactions.balance'] ? parseInt(campaign['transactions.balance']) : 0,
				incomeWithFirstTransaction: campaign['transactions.balanceWithFirstTransaction'] ? parseInt(campaign['transactions.balanceWithFirstTransaction']) : 0,
				rebills:  campaign['transactions.rebills'] ? campaign['transactions.rebills'] : 0,
				activeSubs: activeSubs ? activeSubs.count : 0,
				purchases: campaign['transactions.purchases'] ? campaign['transactions.purchases'] : 0,
			};
	});
};

/**
 * @param {object} params
 * @return {object}
 */
const getUsersStat = async function (params = {}) {
	const totalAmountLiteral = `SUM(CASE WHEN (responseType = 'SUCCESS' AND (billingCycleNumber != 1 OR (billingCycleNumber = 1 AND \`affiliate->campaigns->transactions\`.checkFirstTransaction = 1)))  THEN totalAmount ELSE '0' END)`;
	const balanceLiteral  =`(${totalAmountLiteral} * CASE WHEN referralParentId IS NULL THEN (\`affiliate->campaigns->transactions\`.\`salaryPercent\`)/100 ELSE (\`affiliate->campaigns->transactions\`.\`salaryPercent\` - \`affiliate->campaigns->transactions\`.\`referralPercent\`)/100 END)`;
	const referralBalanceLiteral  =`(${totalAmountLiteral} * \`affiliate->campaigns->transactions\`.\`referralPercent\`)/100`;
	const companyBalanceLiteral  =`(${totalAmountLiteral} * (100 - \`affiliate->campaigns->transactions\`.\`salaryPercent\`))/100`;

	const totalAmountLiteralWithFirstTransaction = `SUM(CASE WHEN responseType = 'SUCCESS' THEN totalAmount ELSE '0' END)`;
	const balanceLiteralWithFirstTransaction  =`(${totalAmountLiteralWithFirstTransaction} * CASE WHEN referralParentId IS NULL THEN (\`affiliate->campaigns->transactions\`.\`salaryPercent\`)/100 ELSE (\`affiliate->campaigns->transactions\`.\`salaryPercent\` - \`affiliate->campaigns->transactions\`.\`referralPercent\`)/100 END)`;
	const referralBalanceLiteralWithFirstTransaction  =`(${totalAmountLiteralWithFirstTransaction} * \`affiliate->campaigns->transactions\`.\`referralPercent\`)/100`;
	const companyBalanceLiteralWithFirstTransaction  =`(${totalAmountLiteralWithFirstTransaction} * (100 - \`affiliate->campaigns->transactions\`.\`salaryPercent\`))/100`;
	const query = {
		include: [
			{
				model: models.UserStatus,
				as: 'status',
			},
			{
				model: models.Affiliate,
				as: 'affiliate',
				required: false,
				duplicating: false,
				include: [
					{
						model: models.Campaign,
						as: 'campaigns',
						required: true,
						duplicating: false,
						include: [
							{
								attributes: [
									[Sequelize.literal(totalAmountLiteral), 'totalAmount'],
									[Sequelize.literal(balanceLiteral), 'balance'],
									[Sequelize.literal(referralBalanceLiteral), 'referralBalance'],
									[Sequelize.literal(companyBalanceLiteral), 'companyBalance'],

									[Sequelize.literal(balanceLiteralWithFirstTransaction), 'balanceWithFirstTransaction'],
									[Sequelize.literal(referralBalanceLiteralWithFirstTransaction), 'referralBalanceWithFirstTransaction'],
									[Sequelize.literal(companyBalanceLiteralWithFirstTransaction), 'companyBalanceWithFirstTransaction'],


									// [Sequelize.literal(`SUM(CASE WHEN (billingCycleNumber = 1 AND responseType = 'SUCCESS') THEN 1 ELSE 0 END)`), 'newSubs'],
									[Sequelize.literal(`COUNT(DISTINCT(CASE WHEN (billingCycleNumber = 1 AND responseType = 'SUCCESS') THEN clientOrderId END))`), 'newSubs'],
									[Sequelize.literal(`SUM(CASE WHEN (responseType = 'HARD_DECLINE') THEN 1 ELSE 0 END)`), 'unSubs'],
									[Sequelize.literal(`SUM(CASE WHEN (billingCycleNumber > 1 AND responseType = 'SUCCESS' AND totalAmount > 0) THEN 1 ELSE 0 END)`), 'rebills'],
									[Sequelize.literal(`COUNT(DISTINCT(CASE WHEN responseType='SUCCESS' THEN orderId END))`), 'purchases'],
									['salaryPercent', 'salaryPercent'],
									['referralPercent', 'referralPercent'],
								],
								model: models.Transaction,
								as: 'transactions',
								required: true,
								duplicating: false,
								where: [
									Sequelize.where(Sequelize.col('affiliate.id'), Op.eq, Sequelize.col('affiliate.campaigns.transactions.affId')),
								],
							}
						],
					},
				],
			},
		],
		where: {
			roleId: userRolesEnum.user.value,
			verifyStatusId: userVerifyStatusesEnum.approved.value,
		},
		group: [Sequelize.col('id')],
		raw: true,
	};

	if(params.id){
		query.where.id = params.id;
	}

	if(params.referralParentId){
		query.where.referralParentId = params.referralParentId;
	}

	const result = await baseRepository.groupByPaginate(models.User, query, params.page, params.countOnPage,'User.id');
	const activeSubsResult = await getUserActiveSubs(params);

	return {
		count: result.count,
		data: result.data.map(transaction => {
			const activeSubs = activeSubsResult.find(user => user.id === transaction['id']);

			return {
				id: transaction['id'],
				name: transaction['name'],
				avatar: transaction['avatar'] ? fileHelper.convertOriginToSmallAvatarPath(`${SERVER_URL}/${transaction['avatar']}`) : null,
				balance: transaction['affiliate.campaigns.transactions.balance'] ? parseInt(transaction['affiliate.campaigns.transactions.balance']): 0,
				referralBalance: transaction['affiliate.campaigns.transactions.referralBalance'] ? parseInt(transaction['affiliate.campaigns.transactions.referralBalance']) : 0,
				balanceWithFirstTransaction: transaction['affiliate.campaigns.transactions.balanceWithFirstTransaction'] ? parseInt(transaction['affiliate.campaigns.transactions.balanceWithFirstTransaction']): 0,
				referralBalanceWithFirstTransaction: transaction['affiliate.campaigns.transactions.referralBalanceWithFirstTransaction'] ? parseInt(transaction['affiliate.campaigns.transactions.referralBalanceWithFirstTransaction']) : 0,
				status:{
					id: transaction['status.id'],
					name: transaction['status.name'],
				},
				unSubs: transaction['affiliate.campaigns.transactions.unSubs'] ? transaction['affiliate.campaigns.transactions.unSubs']: 0,
				rebills: transaction['affiliate.campaigns.transactions.rebills'] ? transaction['affiliate.campaigns.transactions.rebills']: 0,
				activeSubs: activeSubs ? activeSubs.count : 0
			};
		}),
	};
};

/**
 * @param {object} params
 * @param {[]} group
 * @return {object}
 */
const getActiveSubs = async function (params = {}, group = []) {
	const query = {
		attributes: [
			'campaignId',
			'campaign.affiliate.user.id',
			[Sequelize.literal(`COUNT(DISTINCT(Transaction.id))`), 'count'],
			[Sequelize.fn('DATE_FORMAT', Sequelize.col('Transaction.dateCreated'),'%Y-%m-%d'), 'date'],
		],

		include: [
			{
				model: models.Campaign,
				as: 'campaign',
				required: true,
				duplicating: false,
				include: [
					{
						model: models.Affiliate,
						as: 'affiliate',
						require: true,
						duplicating: false,
						include: [
							{
								model: models.User,
								as: 'user',
								required: true,
								duplicating: false,
								include: [
									{
										model: models.UserStatus,
										as: 'status',
									},
								],
							},
						],
					},
				],
			},
		],
		where: [
			Sequelize.where(Sequelize.col('Transaction.id'), Op.in, Sequelize.literal('(SELECT MAX(id) FROM `transactions` GROUP BY orderId)')),
			Sequelize.where(Sequelize.col('responseType'), Op.eq, 'SUCCESS'),
			Sequelize.where(Sequelize.col('Transaction.affId'), Op.eq, Sequelize.col('campaign.affiliate.id')),
		],
		group,
		raw: true,
	};

	if (params.userId) {
		query.where.push(Sequelize.where(Sequelize.col('campaign.affiliate.user.id'), Op.eq, params.userId));
	}

	if (params.filters && params.filters.campaignId) {
		query.where.push(Sequelize.where(Sequelize.col('campaign.id'), Op.eq, params.filters.campaignId));
	}

	if (params.campaignId) {
		query.where.push(Sequelize.where(Sequelize.col('campaign.id'), Op.eq, params.campaignId));
	}

	if(params.referralParentId){
		query.where.push(Sequelize.where(Sequelize.col('campaign.affiliate.user.referralParentId'), Op.eq, params.referralParentId));
	}

	return models.Transaction.findAll(query);
};

/**
 * @param {object} params
 * @return {object}
 */
const getDaysActiveSubs = async function (params = {}) {
	const campaignsActiveSubs = await getActiveSubs(params, ['date']);
	return campaignsActiveSubs.map(campaign => {
		return {
			date: campaign['date'],
			count: campaign['count'],
		};
	});
};

/**
 * @param {object} params
 * @return {object}
 */
const getUserActiveSubs = async function (params = {}) {
	const campaignsActiveSubs = await getActiveSubs(params, ['campaign.affiliate.user.id']);
	return campaignsActiveSubs.map(campaign => {
		return {
			id: campaign['campaign.affiliate.user.id'],
			count: campaign['count'],
		};
	});
};

/**
 * @param {object} params
 * @return {object}
 */
const getCampaignActiveSubs = async function (params = {}) {
	const campaignsActiveSubs = await getActiveSubs(params,['campaign.id']);
	return campaignsActiveSubs.map(campaign => {
		return {
			id: campaign['campaign.id'],
			count: campaign['count'],
		};
	});
};

/**
 * @param {[Object]} data
 * @return {void}
 */
const importData = async function (data) {
	 await models.Transaction.bulkCreate(data, {
		fields:['affId','campaignId','transactionId','orderId', 'totalAmount','responseType','product', 'dateCreated',
			'billingCycleNumber','salaryPercent','referralPercent','itemStatus','clientOrderId','checkFirstTransaction'],
		updateOnDuplicate: [ 'totalAmount','responseType','billingCycleNumber','orderId','salaryPercent','referralPercent','itemStatus','clientOrderId','checkFirstTransaction']
	});
};

module.exports = ({
	getDaysActiveSubs,
	importData,
	getCampaignsStat,
	getUsersStat,
	getDaysStat,
	getDaysStatPagination,
	getUserActiveSubs,
	getCampaignActiveSubs,
});
