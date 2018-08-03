import { createModule } from 'redux-modules';
import { Map } from 'immutable';

const DEFAULT_FIELDS = Map({
	options: null,
	operation: '',
	keys: null,
	showOptions: null,
});

export default createModule({
	name: 'transaction',
	initialState: DEFAULT_FIELDS,
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
		},
		setIn: {
			reducer: (state, { payload }) => {
				state = state.setIn(payload.fields, payload.value);

				return state;
			},
		},
		reset: {
			reducer: (state) => {
				state = DEFAULT_FIELDS;

				return state;
			},
		},
		setOperation: {
			reducer: (state, { payload }) => {
				state = state.set('operation', payload.operation);
				state = state.set('options', new Map(payload.options));
				state = state.set('showOptions', new Map(payload.showOptions));

				return state;
			},
		},
	},
});
