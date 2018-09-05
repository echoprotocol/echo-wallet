import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

const DEFAULT_FIELDS = Map({
	globalLoading: false,
	loading: false,
	error: null,
	activeUser: new Map({
		id: '',
		name: '',
	}),
	visibleBar: false,
	contracts: new Map({}),
	network: new Map({}),
});

export default createModule({
	name: 'global',
	initialState: DEFAULT_FIELDS,
	transformations: {
		setGlobalLoading: {
			reducer: (state, { payload }) => {
				state = state.set('globalLoading', payload.globalLoading);

				return state;
			},
		},
		setLoading: {
			reducer: (state, { payload }) => {
				state = state.set('loading', !!payload);
				return state;
			},
		},
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
		},
		setIn: {
			reducer: (state, { payload }) => {
				Object.keys(payload.params).forEach((field) => {
					state = state.setIn([payload.field, field], payload.params[field]);
				});

				return state;
			},
		},

		toggleBar: {
			reducer: (state, { payload }) => state.set('visibleBar', !payload.value),
		},

		hideBar: {
			reducer: (state) => state.set('visibleBar', false),
		},

		push: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.field, payload.param], payload.value);

				return state;
			},
		},

		update: {
			reducer: (state, { payload }) => {
				const param = state.getIn([payload.field, payload.param]);
				state = state.setIn([payload.field, payload.param], { ...param, ...payload.value });

				return state;
			},
		},

		remove: {
			reducer: (state, { payload }) => {
				state = state.deleteIn([payload.field, payload.param]);

				return state;
			},
		},

		clear: {
			reducer: (state) => {
				const network = state.get('network');

				return _.cloneDeep(DEFAULT_FIELDS).merge({ network });
			},
		},

		disconnect: {
			reducer: () => DEFAULT_FIELDS,
		},
	},
});
