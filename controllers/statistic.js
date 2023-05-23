const coreHttpResponseResultTemplate = require('../core/httpResponseResultTemplate.js');
const statisticService = require('../services/statistic');

/**
 *
 */
const userDaysStatistic = async (req, res) => {
  const result = coreHttpResponseResultTemplate();

  try {
    if (req.query['page']) {
      req.query['page'] = Number(req.query['page']);
    }
    if (req.query['countOnPage']) {
      req.query['countOnPage'] = Number(req.query['countOnPage']);
    }
    if (typeof req.query['filters'] === 'object'
      && req.query['filters']['campaignId']) {
      req.query['filters']['campaignId'] = Number(req.query['filters']['campaignId']);
    }


    result.setData(await statisticService.getUserDayStatistic(req.authUser.id, req.query));
  }
  catch (err) {
    console.error('Caught Error', {
      message: err.message,
      statusCode: err.statusCode,
    });
    result.setMessage(err.message);

    return res
      .status(err.statusCode)
      .json(result.output());
  }
  return res.json(result.output());
};

/**
 *
 */
const userCampaignsStatistic = async (req, res) => {
  const result = coreHttpResponseResultTemplate();

  try {
    result.setData(await statisticService.getUserCampaignsStatistic(req.authUser.id));
  }
  catch (err) {
    console.error('Caught Error', {
      message: err.message,
      statusCode: err.statusCode,
    });
    result.setMessage(err.message);

    return res
      .status(err.statusCode)
      .json(result.output());
  }
  return res.json(result.output());
};

/**
 *
 */
const userGeneralStatistic = async (req, res) => {
  const result = coreHttpResponseResultTemplate();

  try {
    result.setData(await statisticService.getUserGeneralStatistic(req.authUser.id));
  }
  catch (err) {
    console.error('Caught Error', {
      message: err.message,
      statusCode: err.statusCode,
    });
    result.setMessage(err.message);

    return res
      .status(err.statusCode)
      .json(result.output());
  }
  return res.json(result.output());
};

/**
 *
 */
const adminUserGeneralStatistic = async (req, res) => {
  const result = coreHttpResponseResultTemplate();

  try {
    result.setData(await statisticService.getAdminUserGeneralStatistic(req.params.userId));
  }
  catch (err) {
    console.error('Caught Error', {
      message: err.message,
      statusCode: err.statusCode,
    });
    result.setMessage(err.message);

    return res
      .status(err.statusCode)
      .json(result.output());
  }
  return res.json(result.output());
};

/**
 *
 */
const generalStatistic = async (req, res) => {
  const result = coreHttpResponseResultTemplate();

  try {
    result.setData(await statisticService.getGeneralStatistic());
  }
  catch (err) {
    console.error('Caught Error', {
      message: err.message,
      statusCode: err.statusCode,
    });
    result.setMessage(err.message);

    return res
      .status(err.statusCode)
      .json(result.output());
  }
  return res.json(result.output());
};


/**
 *
 */
const partnerStatistic = async (req, res) => {
  const result = coreHttpResponseResultTemplate();

  try {
    if (req.query['page']) {
      req.query['page'] = Number(req.query['page']);
    }
    if (req.query['countOnPage']) {
      req.query['countOnPage'] = Number(req.query['countOnPage']);
    }
    result.setData(await statisticService.getPartnerStatistic(req.query));
  }
  catch (err) {
    console.error('Caught Error', {
      message: err.message,
      statusCode: err.statusCode,
    });
    result.setMessage(err.message);

    return res
      .status(err.statusCode)
      .json(result.output());
  }
  return res.json(result.output());
};

/**
 *
 */
const getCampaignDaysStatistic = async (req, res) => {
  const result = coreHttpResponseResultTemplate();

  try {
    if (req.query['page']) {
      req.query['page'] = Number(req.query['page']);
    }
    if (req.query['countOnPage']) {
      req.query['countOnPage'] = Number(req.query['countOnPage']);
    }
    result.setData(await statisticService.getCampaignDaysStatistic(req.params.userId ,req.params.campaignId, req.query));
  }
  catch (err) {
    console.error('Caught Error', {
      message: err.message,
      statusCode: err.statusCode,
    });
    result.setMessage(err.message);

    return res
      .status(err.statusCode)
      .json(result.output());
  }
  return res.json(result.output());
};

module.exports = {
  userDaysStatistic,
  userCampaignsStatistic,
  userGeneralStatistic,
  adminUserGeneralStatistic,
  getCampaignDaysStatistic,
  generalStatistic,
  partnerStatistic,
};
