import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';

export default createModule({
	name: 'contract',
	initialState: Map({
		functions: List([]),
		constants: List([]),
		id: '',
	}),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
		},
		reset: {
			reducer: (state) => {
				state = state.set('functions', new List([]));
				state = state.set('constants', new List([]));

				return state;
			},
		},
	},
});
