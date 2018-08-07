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

		push: {
			reducer: (state, { payload }) => {
				const field = state.get(payload.field);
				state = state.set(payload.field, field.push(payload.value));

				return state;
			},
		},

		delete: {
			reducer: (state, { payload }) => {
				const field = state.get(payload.field);
				state = state.set(payload.field, field.delete(payload.value));

				return state;
			},
		},
	},
});
