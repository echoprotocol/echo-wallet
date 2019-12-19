import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';
import _ from 'lodash';

const DEFAULT_FIELDS = Map({
	globalLoading: true,
	globalError: null,
	error: null,
	keyWeightWarn: false,
	activeUser: new Map({
		id: '',
		name: '',
	}),
	visibleBar: false,
	contracts: new Map({}),
	network: new Map({
		name: '',
		url: '',
	}),
	networks: new List([]),
	inited: false,
	isConnected: false,
	permissionLoading: false,
	activePaymentTypeTab: 0,
	activeCoinTypeTab: 0,
	currentNode: '',
	localNodePercent: 0,
	isNodeSyncing: false,
	isNodePaused: false,
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

		logout: {
			reducer: (state) => {
				const network = state.get('network');
				const networks = state.get('networks');
				const isConnected = state.get('isConnected');
				const globalLoading = state.get('globalLoading');

				return _.cloneDeep(DEFAULT_FIELDS).merge({
					network, networks, isConnected, globalLoading,
				});
			},
		},

		disconnect: {
			reducer: () => DEFAULT_FIELDS,
		},
	},
});
