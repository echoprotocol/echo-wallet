import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';

const DEFAULT_FIELDS = Map({
	tokens: List([]),
	assets: List([]),
});

export default createModule({
	name: 'balance',
	initialState: DEFAULT_FIELDS,
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

		reset: {
			reducer: (state) => {
				state = DEFAULT_FIELDS;

				return state;
			},
		},
	},
});
