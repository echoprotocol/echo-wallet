import { ChainValidation } from 'echojs-lib';
import { formatSignature } from '../api/ContractApi';

export const getMethod = (method, args) => {
	if (!args || !args.length) {
		return 'Empty field';
	}

	const argsString = args.map((arg) => {
		let newArg = '';
		if (ChainValidation.is_object_id(arg)) {
			newArg = parseInt(arg.substr(arg.lastIndexOf('.') + 1), 10).toString(16).padStart(64, '0');
		} else if ((typeof arg) === 'string') {
			for (let i = 0; i < arg.length; i += 1) {
				if (!Number.isNaN(arg.charAt(i))) {
					newArg += arg.charCodeAt(i).toString(16);
				} else {
					newArg += parseInt(arg.charAt(i), 10).toString(16);
				}
			}
			newArg = newArg.padStart(64, '0');
		}
		return newArg;
	});

	method = formatSignature(method);
	method = method.concat(argsString.join(''));
	return method;
};
