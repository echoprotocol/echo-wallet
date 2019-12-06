import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';

const DEFAULT_FIELDS = Map({
	functions: List([]),
	constants: List([]),
	id: '',
	name: '',
	abi: '',
	bytecode: '',
	balances: [],
	intervalId: null,
	owner: '',
	subscribeCallback: () => {},
});

export default createModule({
	name: 'contract',
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
