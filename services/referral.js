const userReferralRequestsRepository = require('../repositories/user-referral-requests');
const userRepository = require('../repositories/user');
const statisticService = require('./statistic');
const fileHelper = require("../helpers/file");
const { SERVER_URL } = require("../consts");
const orderDayStatisticRepository = require("../repositories/orderDayStatistic");

/**
 * @param {integer} userId
 * @return {object}
 */
const getUserReferralDashboard = async function (userId) {
	const user = await userRepository.getUser({
		id:  userId,
		referrals: true
	});

	const refIds = user.referrals.map(referral => {
		return referral.id;
	});

	const transactions = (await orderDayStatisticRepository.getAffDayStatistic({
		affId: refIds,
	})).map((transaction) => {
		return {
			date: transaction.dateCreated,
			newSubs: transaction.newSaleCompleteCount,
			activeSubs: transaction.newSaleCompleteCount + transaction.recurringCompleteCount,
			unSubs: (transaction.newSaleCanceledCount +  transaction.newSaleRefundedCount + transaction.newSaleDeclinedCount + transaction.recurringCanceledCount + transaction.recurringRefundedCount + transaction.recurringDeclinedCount),
			rebills: transaction.recurringCompleteCount,
			balance: transaction.affAmount,
			companyBalance: transaction.companyAmount,
			referralBalance: transaction.referralAmount,
			balanceWithFirstTransaction: transaction.affOriginAmount,
			companyBalanceWithFirstTransaction: transaction.companyOriginAmount,
			referralBalanceWithFirstTransaction: transaction.referralOriginAmount,
		};
	});
	const result = statisticService.makeUserGeneralStatistic(transactions);
	return {
		referralLink: `${SERVER_URL}/${user.referralKey}`,
		countReferrals: user.referrals.length,
		referralBalance: result.referralBalance,
		rebillsSuccess: result.rebillsSuccess,
		subsSuccess: result.subsSuccess,
		referrals: user.referrals.map(referral => {
			return {
				id: referral.id,
				name: referral.name,
				avatar: referral.avatar ? fileHelper.convertOriginToSmallAvatarPath(`${SERVER_URL}/${referral.avatar}`) : null,
			};
		})
	};
};

/**
 * @param {integer} userId
 * @param {object} params
 * @return {object}
 */
const getUserReferrals = async function (userId, params = {}) {
	const originUser = await userRepository.getUser({
		id:  userId,
		referrals: true
	});

	const affIds = (originUser.referrals.map(referral => {
		if(referral.affiliate){
			return referral.affiliate.id;
		}
	})).filter(ref => !!ref);

	const refIds = (originUser.referrals.map(referral => {
		if(referral.affiliate){
			return referral.id;
		}
	})).filter(ref => !!ref);

	const referralsResponse = (await orderDayStatisticRepository.getAffsStatisticPaginate({
		affId: affIds, ...params
	}));

	const referrals = (await userRepository.getUsersPagination({
		id: refIds, ...params,
		affiliate: true
	}));

	return {
		count: referralsResponse.count,
		data: referrals.users.map(referral => {
			const referralResponse = referralsResponse.data.find(referralResponse => referral.affiliate.id === referralResponse.affId);
			if(referralResponse){
				return {
					id: referral.id,
					name: referral.name,
					avatar: referral.avatar,
					sales: parseInt(referralResponse.referralAmount),
					activeSubs: referralResponse.newSaleCompleteCount + referralResponse.recurringCompleteCount,
					rebills: referralResponse.recurringCompleteCount,
				};
			}

			return {
				id: referral.id,
				name: referral.name,
				avatar: referral.avatar,
				sales: 0,
				activeSubs: 0,
				rebills: 0,
			};
		})
	};
};

/**
 * @param {integer} authUserId
 * @param {integer} referralId
 * @param {object} params
 * @return {object}
 */
const getReferralDayStat = async function (authUserId, referralId, params = {}) {
	const originUser = await userRepository.getUser({
		id:  referralId,
		affiliate: true
	});

	const {
		filters = {}
	} = params;

	params = {
		affId: originUser.affiliate.id,
		...params,
		...filters
	};

	const result = await orderDayStatisticRepository.getAffDayStatisticPagination({
		affId: originUser.affiliate.id, ...params
	});

	const totalResponse = await orderDayStatisticRepository.getAffCampaignsStatistic(params);
	let total ={
		activeSubs: 0,
		rebills: 0,
		sales: 0,
	};

	totalResponse.map(totalResp => {
			total.activeSubs += totalResp.newSaleCompleteCount + totalResp.recurringCompleteCount;
			total.rebills += totalResp.recurringCompleteCount;
			total.sales += totalResp.referralAmount;
	});

	total.sales = parseInt(total.sales);

	return {
		count: result.count,
		data: {
			total: total,
			days: result.data.map(transaction => {
				return {
					date: transaction.dateCreated,
					activeSubs: transaction.newSaleCompleteCount + transaction.recurringCompleteCount,
					rebills: transaction.recurringCompleteCount,
					sales: parseInt(transaction.referralAmount),
				};
			})
		},
	};
};

/**
 * @param {object} props
 * @return {object}
 */
const getReferralParentId = async function ({ referralKey, email }) {
	const refRequest = await userReferralRequestsRepository.getOne({ email });
	if(refRequest) {
		return refRequest.userId;
	}

	if(!referralKey){
		return null;
	}

	const user = await userRepository.getOne({ referralKey });
	return user.id;
};

/**
 * @param {object} props
 * @return {object}
 */
const deleteRequest = async function ({ email }) {
	return userReferralRequestsRepository.remove({ email });
};


module.exports = ({
	getUserReferralDashboard,
	getUserReferrals,
	getReferralDayStat,
	deleteRequest,
	getReferralParentId
});
