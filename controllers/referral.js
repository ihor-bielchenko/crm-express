const coreHttpResponseResultTemplate = require('../core/httpResponseResultTemplate.js');
const referralService = require('../services/referral');

/**
 *
 */
const userReferralDashboard = async (req, res) => {
  const result = coreHttpResponseResultTemplate();
  try {
    result.setData(await referralService.getUserReferralDashboard(req.authUser.id, req.body));
  }
  catch (err) {
    console.error('Caught Error', {
      message: err.message,
      statusCode: err.statusCode,
    });
    result.setMessage(err.message);

    return res
      .status(err.statusCode ?? 500)
      .json(result.output());
  }
  return res.json(result.output());
};

/**
 *
 */
const userReferrals = async (req, res) => {
  const result = coreHttpResponseResultTemplate();
  try {
    if (req.query['page']) {
      req.query['page'] = Number(req.query['page']);
    }
    if (req.query['countOnPage']) {
      req.query['countOnPage'] = Number(req.query['countOnPage']);
    }
    result.setData(await referralService.getUserReferrals(req.authUser.id, req.query));
  }
  catch (err) {
    console.error('Caught Error', {
      message: err.message,
      statusCode: err.statusCode,
    });
    result.setMessage(err.message);

    return res
      .status(err.statusCode ?? 500)
      .json(result.output());
  }
  return res.json(result.output());
};

/**
 *
 */
const referralDayStat = async (req, res) => {
  const result = coreHttpResponseResultTemplate();
  try {
    if (req.query['page']) {
      req.query['page'] = Number(req.query['page']);
    }
    if (req.query['countOnPage']) {
      req.query['countOnPage'] = Number(req.query['countOnPage']);
    }
    result.setData(await referralService.getReferralDayStat(req.authUser.id, req.params.id, req.query));
  }
  catch (err) {
    console.error('Caught Error', {
      message: err.message,
      statusCode: err.statusCode,
    });
    result.setMessage(err.message);

    return res
      .status(err.statusCode ?? 500)
      .json(result.output());
  }
  return res.json(result.output());
};


module.exports = {
  userReferralDashboard,
  userReferrals,
  referralDayStat,
};
