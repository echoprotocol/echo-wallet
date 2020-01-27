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

export function get(url, params, headersParams = {}) {
	const query = qs.stringify(params);

	const headers = new Headers(headersParams);
	const options = {
		method: 'GET',
		headers,
		cache: 'default',
	};

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

export function post(url, params, headers = {}) {
	const options = {
		method: 'POST',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
			...headers,
		},
		cache: 'default',
		mode: 'cors',
		body: JSON.stringify(params),

	};

	return new Promise((resolve, reject) => {
		fetch(url, options).then((response) => {
			const contentType = response.headers.get('content-type');
			if (response.ok) {
				if (contentType && contentType.indexOf('application/json') !== -1) {
					return response.json();
				}
				return response.text();

			}
			return response.json().then((error) => {
				// eslint-disable-next-line no-throw-literal
				throw { status: error.status, message: error.error.message || error.error };
			});

		}).then((data) => {
			resolve(data);
		}).catch((error) => {
			reject(error);
		});
	});
}
