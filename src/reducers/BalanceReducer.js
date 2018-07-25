import { createModule } from 'redux-modules';
import { Map } from 'immutable';

export default createModule({
	name: 'balance',
	initialState: Map({
		tokens: Map({}),
	}),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
		},
	},
});
