'use strict';
require('dotenv').config();

const express = require('express');
const expressSubdomain = require('express-subdomain');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const expressBrute = require('express-brute');
const fileUpload = require('express-fileupload');

const onWarning = require('./handlers/onWarning.js');
const onExit = require('./handlers/onExit.js');
const onUncaughtException = require('./handlers/onUncaughtException.js');
const onUncaughtExceptionMonitor = require('./handlers/onUncaughtExceptionMonitor.js');

const middlewareCheckHasPassword = require('./middlewares/checkHasPassword.js');
const middlewareCheckHasPasswordConfirm = require('./middlewares/checkHasPasswordConfirm.js');
const middlewareCheckPasswordsMismatch = require('./middlewares/checkPasswordsMismatch.js');
const middlewareCheckHasOldPassword = require('./middlewares/checkHasOldPassword.js');
const middlewareCheckHasNewPasswords = require('./middlewares/checkHasNewPasswords.js');
const middlewareCheckNewPasswordsMismatch = require('./middlewares/checkNewPasswordsMismatch.js');
const middlewareValidateUserPersonalData = require('./middlewares/validateUserPersonalData.js');
const middlewareValidateUserLocationData = require('./middlewares/validateUserLocationData.js');
const middlewareValidateUserCommunicationData = require('./middlewares/validateUserCommunicationData.js');
const middlewareValidateAccountVerifyKey = require('./middlewares/validateAccountVerifyKey.js');
const middlewareCheckHasLoginData = require('./middlewares/checkHasLoginData.js');
const middlewareCheckHasJWTRefreshToken = require('./middlewares/checkHasJWTRefreshToken.js');
const middlewareCheckHasJWTAccessToken = require('./middlewares/checkHasJWTAccessToken.js');
const middlewareCheckJWTRefreshToken = require('./middlewares/checkJWTRefreshToken.js');
const middlewareCheckJWTAccessToken = require('./middlewares/checkJWTAccessToken.js');
const middlewareValidateUserEmail = require('./middlewares/validateUserEmail.js');
const middlewareCheckAdmin = require('./middlewares/checkAdmin');
const middlewareCheckAvatar = require('./middlewares/checkAvatar');
const middlewareCheckUpdateByEmail = require('./middlewares/checkUpdateByEmail.js');

const controllerRegister = require('./controllers/register.js');
const controllerVerify = require('./controllers/verify.js');
const controllerLogin = require('./controllers/login.js');
const controllerRecovery = require('./controllers/recovery.js');
const controllerReset = require('./controllers/reset.js');
const controllerRefresh = require('./controllers/refresh.js');
const controllerUserPassword = require('./controllers/userPassword.js');
const controllerStatistic = require('./controllers/statistic');
const controllerUser = require('./controllers/user');
const controllerReferral = require('./controllers/referral');
const controllerUpsellGet = require('./controllers/upsellGet.js');
const controllerUpsellCreate = require('./controllers/upsellCreate.js');
const controllerConfig = require('./controllers/config');

const port = process.env.APP_EXPRESS_PORT || 3012;
const app = express();
// const bruteforce = new expressBrute((new expressBrute.MemoryStore()));

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bruteforce.getMiddleware());
app.use(express.static('public'));

app.post('/register', [
	middlewareCheckHasPassword,
	middlewareCheckHasPasswordConfirm,
	middlewareCheckPasswordsMismatch,
	middlewareValidateUserPersonalData,
	middlewareValidateUserLocationData,
	middlewareValidateUserCommunicationData,
], controllerRegister);

app.patch('/verify', [
	middlewareValidateAccountVerifyKey,
], controllerVerify);

app.get('/login', [
	middlewareCheckHasLoginData,
	middlewareCheckHasPassword,
], controllerLogin);

app.post('/recovery', [
	middlewareValidateUserEmail,
], controllerRecovery);

app.post('/reset', [
	middlewareCheckHasPassword,
	middlewareCheckHasPasswordConfirm,
	middlewareCheckPasswordsMismatch,
	middlewareValidateAccountVerifyKey,
], controllerReset);

app.post('/refresh', [
	middlewareCheckHasJWTAccessToken,
	middlewareCheckHasJWTRefreshToken,
	middlewareCheckJWTAccessToken,
	middlewareCheckJWTRefreshToken,
], controllerRefresh);

app.patch('/user', fileUpload(), [
	middlewareCheckHasJWTAccessToken,
	middlewareCheckJWTAccessToken,
	middlewareValidateUserPersonalData,
	middlewareValidateUserLocationData,
	middlewareValidateUserCommunicationData,
], controllerUser.update);

app.use('/storage/avatar',[
	middlewareCheckHasJWTAccessToken,
	middlewareCheckJWTAccessToken,
	middlewareCheckAvatar,
], express.static('storage/avatar'));

app.patch('/user/password', [
	middlewareCheckHasJWTAccessToken,
	middlewareCheckJWTAccessToken,
	middlewareCheckHasOldPassword,
	middlewareCheckHasNewPasswords,
	middlewareCheckNewPasswordsMismatch,
], controllerUserPassword);

app.get('/revenue-media-upsell', controllerUpsellGet);
app.post('/upsell', controllerUpsellCreate);

//User routes
app.use([
	'/user/days/statistic',
	'/user/campaigns/statistic',
	'/user/general/statistic',
	'/user',
	'/user/:userId',
	'/user/referral/dashboard',
	'/user/referrals'
], [
	middlewareCheckHasJWTAccessToken,
	middlewareCheckJWTAccessToken,
]);
app.get('/user/days/statistic', controllerStatistic.userDaysStatistic);
app.get('/user/campaigns/statistic', controllerStatistic.userCampaignsStatistic);
app.get('/user/general/statistic', controllerStatistic.userGeneralStatistic);
app.get('/user/referral/general/statistic', controllerReferral.userReferralDashboard);
app.get('/user/referrals', controllerReferral.userReferrals);
app.get('/user/referral/:id/days', controllerReferral.referralDayStat);

app.get('/user/:userId', [
	middlewareCheckHasJWTAccessToken,
	middlewareCheckJWTAccessToken,
], controllerUser.adminGetOne);

//Admin routes
app.use([
	'/requests',
	'/requests/history',
	'/user/:userId',
	'/general/statistic',
	'/partner/statistic',
	'/admin/user/:userId/general/statistic',
	'/campaign/:campaignId/days/statistic',
], [
	middlewareCheckHasJWTAccessToken,
	middlewareCheckJWTAccessToken,
	middlewareCheckAdmin,
]);
app.put('/user/:userId', controllerUser.adminUpdateUser);
app.patch('/user/email', [
	middlewareCheckUpdateByEmail,
], controllerUser.adminUpdateUserByEmail);
app.get('/requests', controllerUser.getRequests);
app.post('/requests/history', controllerUser.getRequestsHistory);

app.get('/general/statistic', controllerStatistic.generalStatistic);
app.get('/partner/statistic', controllerStatistic.partnerStatistic);
app.get('/admin/user/:userId/general/statistic', controllerStatistic.adminUserGeneralStatistic);
app.get('/user/:userId/campaign/:campaignId/days/statistic', controllerStatistic.getCampaignDaysStatistic);

app.get('/server/statuses', controllerConfig);



app.listen(port, () => {
	console.log(`Service successfully started at ${process.env.APP_URL}`);
});

process.on('exit', onExit);
process.on('warning', onWarning);
process.on('uncaughtException', onUncaughtException);
process.on('uncaughtExceptionMonitor', onUncaughtExceptionMonitor);
