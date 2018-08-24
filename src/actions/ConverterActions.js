import { List } from 'immutable';
import ConverterReducer from '../reducers/ConverterReducer';
import { converter } from '../helpers/FormatHelper';

export const resetConverter = () => (dispatch) => {
	dispatch(ConverterReducer.actions.reset());
};

export const convert = (type, data, component) => (dispatch, getState) => {
	let convertedConstants = getState().converter.get('convertedConstants').toJS();
	let topics = getState().converter.get('topics').toJS();

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
	} else {
		topics = topics.filter((val) => val.id !== component);

		dispatch(ConverterReducer.actions.set({ field: 'topics', value: new List(topics) }));
	}
};
