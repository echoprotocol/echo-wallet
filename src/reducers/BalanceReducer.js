import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';

export default createModule({
	name: 'balance',
	initialState: Map({
		tokens: List([]),
		assets: List([]),
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
