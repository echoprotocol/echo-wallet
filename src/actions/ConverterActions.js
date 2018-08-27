import { List } from 'immutable';
import ConverterReducer from '../reducers/ConverterReducer';
import { converter } from '../helpers/FormatHelper';

export const resetConverter = () => (dispatch) => {
	dispatch(ConverterReducer.actions.reset());
};

export const convert = (type, data, component) => (dispatch, getState) => {
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
					isChanged = true;
				}
				return val;
			});

			if (!isChanged) {
				convertedConstants.push({
					name: component.name,
					value: result,
				});
			}

			dispatch(ConverterReducer.actions.set({ field: 'convertedConstants', value: new List(convertedConstants) }));
		} else if (component === 'dataLog') {
			dispatch(ConverterReducer.actions.set({ field: 'data', value: result }));
		} else if (component.substr(0, 8) === 'bytecode') {
			let isChanged = false;

			args = args.map((val) => {
				if (val.id === component.substr(8)) {
					val.value = result;
					isChanged = true;
				}
				return val;
			});

			if (!isChanged) {
				args.push({
					id: component.substr(8),
					value: result,
				});
			}

			dispatch(ConverterReducer.actions.set({ field: 'bytecodeArgs', value: new List(args) }));
		} else {
			let isChanged = false;

			topics = topics.map((val) => {
				if (val.id === component) {
					val.value = result;
					isChanged = true;
				}
				return val;
			});

			if (!isChanged) {
				topics.push({
					id: component,
					value: result,
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
