
const scriptText = ({
	campaignId,
	affiliateId,
	productId,
	salesUrl,
	successUrl,
	failureUrl,
	variant,
}) => `(function () {
	var clickFlag = false,
		campaignId = ${campaignId},
		affiliateId = ${affiliateId ? ("'"+ affiliateId +"'") : 'undefined'},
		productId = ${productId},
		salesUrl = '${salesUrl}',
		successUrl = ${successUrl ? ("'"+ successUrl +"'") : 'undefined'},
		failureUrl = ${failureUrl ? ("'"+ failureUrl +"'") : 'undefined'},
		variant = '${variant}';

	(function () {
		window.revenueMediaUpsell = function (data = {}) {
			if (!clickFlag) {
				clickFlag = true;

				if (!(campaignId
					&& productId
					&& salesUrl
					&& data.firstName
					&& data.lastName
					&& data.address1
					&& data.postalCode
					&& data.country
					&& data.city
					&& data.state
					&& data.emailAddress
					&& data.phoneNumber
					&& data.cardNumber
					&& data.cardMonth
					&& data.cardYear
					&& data.cardSecurityCode)) {
					throw new Error('All required parameters not specified');
				}
				var revenueMediaUpsellCheckbox = document.getElementsByClassName('revenue-media-upsell-checkbox'),
					checboxFlag;

				if (revenueMediaUpsellCheckbox[0]) {
					checboxFlag = revenueMediaUpsellCheckbox[0].checked;
				}

				if (typeof checboxFlag === 'boolean') {
					if (checboxFlag) {
						var requestOptions = {
							method: 'POST',
							body: '',
							redirect: 'follow',
						};
						var query = `+'`'+ '?firstName=${data.firstName}&lastName=${data.lastName}&postalCode=${data.postalCode}&city=${data.city}&state=${data.state}&country=${data.country}&emailAddress=${data.emailAddress}&phoneNumber=${data.phoneNumber}&cardNumber=${data.cardNumber}&cardMonth=${data.cardMonth}&cardYear=${data.cardYear}&cardSecurityCode=${data.cardSecurityCode}&campaignId=${campaignId}&product1_id=${productId}&product1_qty=1&address1=${data.address1}&salesUrl=${salesUrl}' +'`;'+`

						if (data.address2) {
							query += `+'`'+ '&address2=${data.address2}' +'`'+`;
						}
						if (affiliateId) {
							query += `+'`'+ '&affId=${affiliateId}' +'`'+`;
						}
						fetch('${process.env.APP_URL}/upsell'+ query, requestOptions)
							.then(response => response.text())
							.then(result => {
								if (typeof result === 'object'
									&& typeof result.data === 'object'
									&& result.data.result === 'ERROR') {
									if (failureUrl) {
										window.location.href = failureUrl;
									}
								}
								else if (typeof result === 'string') {
									var content = JSON.parse(result);

									if (typeof content === 'object' 
										&& typeof content.data === 'object'
										&& content.data.result === 'ERROR') {
										if (failureUrl) {
											window.location.href = failureUrl;
										}
									}
									else {
										window.dispatchEvent((new CustomEvent('RevenueMediaBannerSuccess', {
											detail: result,
										})));

										if (successUrl) {
											window.location.href = successUrl;
										}
									}
								}
								clickFlag = false;
							})
							.catch(error => {
								window.dispatchEvent((new CustomEvent('RevenueMediaBannerFailure', {
									detail: error,
								})));

								if (failureUrl) {
									window.location.href = failureUrl;
								}
								clickFlag = false;
							});
					}
					else {
						if (successUrl) {
							window.location.href = successUrl;
						}
					}
				}
				else {
					var query = `+'`'+ '?firstName=${data.firstName}&lastName=${data.lastName}&postalCode=${data.postalCode}&city=${data.city}&state=${data.state}&country=${data.country}&emailAddress=${data.emailAddress}&phoneNumber=${data.phoneNumber}&cardNumber=${data.cardNumber}&cardMonth=${data.cardMonth}&cardYear=${data.cardYear}&cardSecurityCode=${data.cardSecurityCode}&campaignId=${campaignId}&product1_id=${productId}&product1_qty=1&address1=${data.address1}&salesUrl=${salesUrl}' +'`;'+`

					if (affiliateId) {
						query += `+'`'+ '&affId=${affiliateId}' +'`'+`;
					}
					if (data.address2) {
						query += `+'`'+ '&address2=${data.address2}' +'`'+`;
					}
					if (successUrl) {
						query += `+'`'+ '&successUrl=${successUrl}' +'`'+`;
					}
					if (failureUrl) {
						query += `+'`'+ '&failureUrl=${failureUrl}' +'`'+`;
					}

					setTimeout(() => {
						window.location.href = '${process.env.APP_URL}/${variant}.html'+ query;
						clickFlag = false;
					}, 0);
				}
			}
		};
	})();
})();`;

/**
 * 
 */
const upsellGet = async (req, res) => {
	try {
		const {
			campaignId,
			affiliateId,
			productId,
			salesUrl,
			successUrl,
			failureUrl,
			variant = 'upsell3',
		} = req.query;

		return res
			.type('text/javascript')
			.send(scriptText({
				campaignId,
				affiliateId,
				productId,
				salesUrl,
				successUrl,
				failureUrl,
				variant,
			}));
	}
	catch (err) {
		return res
			.type('text/javascript')
			.send('');
	}
	return res
		.type('text/javascript')
		.send('');
};

module.exports = upsellGet;
