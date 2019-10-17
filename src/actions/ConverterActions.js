import { List } from 'immutable';
import ConverterReducer from '../reducers/ConverterReducer';
import { converter } from '../helpers/FormatHelper';

/**
 * @method resetConverter
 */
export const resetConverter = () => (dispatch) => {
	dispatch(ConverterReducer.actions.reset());
};

/**
 * @method convert
 *
 * @param {*} type
 * @param {*} data
 * @param {*} component
 * @param {*} key
 */
export const convert = (type, data, component, key) => (dispatch, getState) => {
	let convertedConstants = getState().converter.get('convertedConstants').toJS();
	let topics = getState().converter.get('topics').toJS();
	let args = getState().converter.get('bytecodeArgs').toJS();

	const result = converter(type, data);

	if (result) {
		if (component.name) {
			let isChanged = false;

			convertedConstants = convertedConstants.map((val) => {
				if (val.name === component.name) {
					val.value = result;
					val.type = type;
					isChanged = true;
				}
				return val;
			});

			if (!isChanged) {
				convertedConstants.push({
					name: component.name,
					value: result,
					type,
				});
			}

			dispatch(ConverterReducer.actions.set({ field: 'convertedConstants', value: new List(convertedConstants) }));
		} else if (component === 'dataLog') {
			const dataLog = {
				value: result,
				type,
				key,
			};
			dispatch(ConverterReducer.actions.set({ field: 'data', value: dataLog }));
		} else if (component.substr(0, 8) === 'bytecode') {
			let isChanged = false;

			args = args.map((val) => {
				if (val.id === component.substr(8)) {
					val.value = result;
					val.type = type;
					isChanged = true;
				}
				return val;
			});

			if (!isChanged) {
				args.push({
					id: component.substr(8),
					value: result,
					type,
				});
			}

			dispatch(ConverterReducer.actions.set({ field: 'bytecodeArgs', value: new List(args) }));
		} else {
			let isChanged = false;
			topics = topics.map((val) => {
				if (val.id === component && val.key === key) {
					val.value = result;
					val.type = type;
					isChanged = true;
				}
				return val;
			});

			if (!isChanged) {
				topics.push({
					id: component,
					value: result,
					type,
					key,
				});
			}
			dispatch(ConverterReducer.actions.set({ field: 'topics', value: new List(topics) }));
		}
	} else if (component.name) {
		convertedConstants = convertedConstants.filter((val) => val.name !== component.name);

		dispatch(ConverterReducer.actions.set({ field: 'convertedConstants', value: new List(convertedConstants) }));
	} else if (component === 'dataLog') {
		dispatch(ConverterReducer.actions.set({ field: 'data', value: '' }));
	} else if (component.substr(0, 8) === 'bytecode') {
		args = args.filter((val) => val.id !== component.substr(8));

		dispatch(ConverterReducer.actions.set({ field: 'bytecodeArgs', value: new List(args) }));
	} else {
		topics = topics.filter((val) => val.id !== component);

		dispatch(ConverterReducer.actions.set({ field: 'topics', value: new List(topics) }));
	}
};
