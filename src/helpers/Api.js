import qs from 'qs';

require('isomorphic-fetch');

const parseServerError = (error) => {
	const { message } = error;
	if (typeof message !== 'string') {
		if (Object.keys(message).length) {
			const firstKey = Object.keys(message)[0];
			return {
				status: error.status,
				message: `${firstKey}: ${message[firstKey] ? message[firstKey][0] : 'Error'}`,
				error: error.message,
			};
		}
		if (Array.isArray(error.message) && error.message.length) {
			return { status: error.status, message: error.message[0] };
		}
	}

	return { status: error.status, message: error.message };
};

export function get(url, params, credentials) {
	const query = qs.stringify(params);

	const headers = new Headers();
	const options = {
		method: 'GET',
		headers,
		cache: 'default',
	};

	if (credentials) {
		options.credentials = 'include';
	}

	return new Promise((resolve, reject) => {
		fetch(`${url}?${query}`, options).then((response) => {
			const contentType = response.headers.get('content-type');

			if (response.ok) {
				if (contentType && contentType.indexOf('application/json') !== -1) {
					return response.json();
				}
				return response.text();

			}
			return response.json().then((error) => {
				// eslint-disable-next-line no-throw-literal
				throw { status: error.status, message: error.error };
			});

		}).then((data) => {
			resolve(data);
		}).catch((error) => {
			reject(parseServerError(error));
		});
	});
}
