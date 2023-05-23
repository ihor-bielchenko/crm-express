
(function () {
	document.addEventListener('DOMContentLoaded', function () {
		var revenueMediaUpsalleCheckbox = document.getElementsByClassName('revenue-media-upsalle-checkbox');

		if (revenueMediaUpsalleCheckbox[0]) {
			window.revenueMediaUpsalleCheckbox = revenueMediaUpsalleCheckbox[0].checked;
		}
	});
	window.revenueMediaUpsalleFire = function () {
		var revenueMediaUpsalleCheckbox = document.getElementsByClassName('revenue-media-upsalle-checkbox');

		if (revenueMediaUpsalleCheckbox[0]) {
			window.revenueMediaUpsalleCheckbox = revenueMediaUpsalleCheckbox[0].checked;
		}
		var revenueMediaUpsalleButtons = document.getElementsByClassName('revenue-media-upsalle');
		var target = revenueMediaUpsalleButtons[0];

		if (target) {
			var campaignId = target.dataset.campaignid,
				product1_id = target.dataset.product1_id,
				firstName = target.dataset.firstname,
				lastName = target.dataset.lastname,
				address1 = target.dataset.address1,
				address2 = target.dataset.address2,
				postalCode = target.dataset.postalcode,
				city = target.dataset.city,
				state = target.dataset.state,
				country = target.dataset.country,
				emailAddress = target.dataset.emailaddress,
				phoneNumber = target.dataset.phonenumber,
				cardNumber = target.dataset.cardnumber,
				cardMonth = target.dataset.cardmonth,
				cardYear = target.dataset.cardyear,
				cardSecurityCode = target.dataset.cardsecuritycode,
				salesUrl = target.dataset.salesurl,
				successUrl = target.dataset.successurl,
				failureUrl = target.dataset.failureurl;

			if (typeof window.revenueMediaUpsalleCheckbox === 'boolean') {
				if (window.revenueMediaUpsalleCheckbox) {
					if (campaignId
						&& product1_id
						&& firstName
						&& lastName
						&& address1
						&& postalCode
						&& country
						&& city
						&& state
						&& emailAddress
						&& phoneNumber
						&& cardNumber
						&& cardMonth
						&& cardYear
						&& cardSecurityCode
						&& salesUrl) {
						var requestOptions = {
							method: 'POST',
							body: '',
							redirect: 'follow',
						};
						var query = `?firstName=${firstName}&lastName=${lastName}&postalCode=${postalCode}&city=${city}&state=${state}&country=${country}&emailAddress=${emailAddress}&phoneNumber=${phoneNumber}&cardNumber=${cardNumber}&cardMonth=${cardMonth}&cardYear=${cardYear}&cardSecurityCode=${cardSecurityCode}&campaignId=${campaignId}&product1_id=${product1_id}&product1_qty=1&address1=${address1}`;

						if (address2) {
							query += `&address2=${address2}`;
						}
						if (salesUrl) {
							query += `&salesUrl=${salesUrl}`;
						}
						fetch('https://rm.bondar.agency/upsale'+ query, requestOptions)
							.then(response => response.text())
							.then(result => {
								var revenueMediaBannerSuccess = new CustomEvent('RevenueMediaBannerSuccess', {
									detail: result,
								});

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
										if (successUrl) {
											window.location.href = successUrl;
										}
									}
								}
								window.dispatchEvent(revenueMediaBannerSuccess);
							})
							.catch(error => {
								var revenueMediaBannerFailure = new CustomEvent('RevenueMediaBannerFailure', {
									detail: error,
								});
								window.dispatchEvent(revenueMediaBannerFailure);

								if (failureUrl) {
									window.location.href = failureUrl;
								}
							});
					}
				}
				else {
					if (successUrl) {
						window.location.href = successUrl;
					}
				}
			}
			else {
				if (campaignId
					&& product1_id
					&& firstName
					&& lastName
					&& address1
					&& postalCode
					&& country
					&& city
					&& state
					&& emailAddress
					&& phoneNumber
					&& cardNumber
					&& cardMonth
					&& cardYear
					&& cardSecurityCode
					&& salesUrl) {
					var query = `?firstName=${firstName}&lastName=${lastName}&postalCode=${postalCode}&city=${city}&state=${state}&country=${country}&emailAddress=${emailAddress}&phoneNumber=${phoneNumber}&cardNumber=${cardNumber}&cardMonth=${cardMonth}&cardYear=${cardYear}&cardSecurityCode=${cardSecurityCode}&campaignId=${campaignId}&product1_id=${product1_id}&product1_qty=1&address1=${address1}`;

					if (address2) {
						query += `&address2=${address2}`;
					}
					if (salesUrl) {
						query += `&salesUrl=${salesUrl}`;
					}
					if (successUrl) {
						query += `&successUrl=${successUrl}`;
					}
					if (failureUrl) {
						query += `&failureUrl=${failureUrl}`;
					}

					setTimeout(() => {
						window.location.href = 'https://rm.bondar.agency/upsell3.html'+ query;
					}, 0);
				}
			}
		}
	};
})();