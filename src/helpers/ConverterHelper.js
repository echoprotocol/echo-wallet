import utf8 from 'utf8';

export const toUtf8 = (hex) => {
	let str = '';

	for (let i = 0; i < hex.length; i += 2) {
		const code = parseInt(hex.substr(i, 2), 16);
		if (code !== 0) {
			str += String.fromCharCode(code);
		}
	}
	return utf8.decode(str);
};

export const toInt = (hex) => parseInt(hex, 16);
