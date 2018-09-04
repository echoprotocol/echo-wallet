import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';

const DEFAULT_FIELDS = Map({
	active: new Map({
		accounts: new List(),
		keys: new List(),
	}),
	owner: new Map({
		accounts: new List(),
		keys: new List(),
	}),
	note: new Map({
		keys: new List(),
	}),
});

export default createModule({
	name: 'permission',
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

		update: {
			reducer: (state, { payload }) => {
				const index = state.getIn(payload.fields).findIndex((t) => (t.key === payload.param));
				if (index === -1) return state;
				const updatedList = state
					.getIn(payload.fields)
					.update(index, (v) => ({ ...v, ...payload.value }));

				state = state.setIn(payload.fields, updatedList);

				return state;
			},
		},

		clear: {
			reducer: (state) => {
				state = DEFAULT_FIELDS;

				return state;
			},
		},
	},
});
