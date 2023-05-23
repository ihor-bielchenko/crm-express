
(function () {
	document.addEventListener('DOMContentLoaded', function () {
		var revenueMediaUpsalleCheckbox = document.getElementsByClassName('revenue-media-upsalle-checkbox');

		if (revenueMediaUpsalleCheckbox[0]) {
			window.revenueMediaUpsalleCheckbox = revenueMediaUpsalleCheckbox[0].checked;
		}
	});
	window.revenueMediaUpsalleFire = function (campaignId, product1Id, data = {}) {
		var revenueMediaUpsalleCheckbox = document.getElementsByClassName('revenue-media-upsalle-checkbox');

		if (revenueMediaUpsalleCheckbox[0]) {
			window.revenueMediaUpsalleCheckbox = revenueMediaUpsalleCheckbox[0].checked;
		}
		var firstName = data.firstName,
			lastName = data.lastName,
			address1 = data.address1,
			address2 = data.address2,
			postalCode = data.postalCode,
			city = data.city,
			state = data.state,
			country = data.country,
			emailAddress = data.emailAddress,
			phoneNumber = data.phoneNumber,
			cardNumber = data.cardNumber,
			cardMonth = data.cardMonth,
			cardYear = data.cardYear,
			cardSecurityCode = data.cardSecurityCode,
			salesUrl = data.salesUrl,
			successUrl = data.successUrl,
			failureUrl = data.failureUrl;

		if (typeof window.revenueMediaUpsalleCheckbox === 'boolean') {
			if (window.revenueMediaUpsalleCheckbox) {
				if (campaignId
					&& product1Id
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
					var query = `?firstName=${firstName}&lastName=${lastName}&postalCode=${postalCode}&city=${city}&state=${state}&country=${country}&emailAddress=${emailAddress}&phoneNumber=${phoneNumber}&cardNumber=${cardNumber}&cardMonth=${cardMonth}&cardYear=${cardYear}&cardSecurityCode=${cardSecurityCode}&campaignId=${campaignId}&product1_id=${product1Id}&product1_qty=1&address1=${address1}`;

					if (address2) {
						query += `&address2=${address2}`;
					}
					if (salesUrl) {
						query += `&salesUrl=${salesUrl}`;
					}
					fetch('https://api.revenue.media/upsale'+ query, requestOptions)
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
				&& product1Id
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
				var query = `?firstName=${firstName}&lastName=${lastName}&postalCode=${postalCode}&city=${city}&state=${state}&country=${country}&emailAddress=${emailAddress}&phoneNumber=${phoneNumber}&cardNumber=${cardNumber}&cardMonth=${cardMonth}&cardYear=${cardYear}&cardSecurityCode=${cardSecurityCode}&campaignId=${campaignId}&product1_id=${product1Id}&product1_qty=1&address1=${address1}`;

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
					window.location.href = 'https://api.revenue.media/upsell4.html'+ query;
				}, 0);
			}
		}
	};
})();