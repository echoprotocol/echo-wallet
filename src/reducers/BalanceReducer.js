import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';

const DEFAULT_FIELDS = Map({
	tokens: List([]),
	assets: List([]),
	core: {}, // { precision, symbol }
	accountsBalances: List([]),
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

		update: {
			reducer: (state, { payload }) => {
				const index = state.get(payload.field).findIndex((t) => (t.id === payload.param));
				if (index === -1) return state;
				const updatedList = state
					.get(payload.field)
					.update(index, (v) => ({ ...v, ...payload.value }));

				state = state.set(payload.field, updatedList);

				return state;
			},
		},
	},
});
