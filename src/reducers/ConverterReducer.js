import { createModule } from 'redux-modules';
import { List, Map } from 'immutable';

const DEFAULT_FIELDS = Map({
	data: '',
	topics: List([]),
	convertedConstants: List([]),
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
		reset: {
			reducer: (state) => {
				state = DEFAULT_FIELDS;

				return state;
			},
		},
	},
});
