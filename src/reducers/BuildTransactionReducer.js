import { createModule } from 'redux-modules';
import { Map } from 'immutable';

export default createModule({
	name: 'buildtransaction',
	initialState: Map({}),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
		},
		setTransaction: {
			reducer: (state, { payload }) => {
				state = new Map(payload.value);

				return state;
			},
		},
		reset: {
			reducer: (state) => {
				state = new Map({});

				return state;
			},
		},
	},
});
