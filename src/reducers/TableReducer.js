import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';
import _ from 'lodash';

import { COMMITTEE_TABLE, HISTORY_TABLE, PERMISSION_TABLE } from '../constants/TableConstants';

const DEFAULT_FIELDS = Map({
	loading: false,
	error: null,
});

const DEFAULT_TABLE_FIELDS = {
	[HISTORY_TABLE]: Map({
		loading: true,
		data: null,
		activeTransaction: '',
	}),
	[PERMISSION_TABLE]: Map({
		active: new Map({
			threshold: null,
			accounts: new List(),
			keys: new List(),
		}),
		echoRand: new Map({
			keys: new List(),
		}),
		permissionKey: {
			key: '',
			type: '',
			role: '',
		},
		showLoader: false,
	}),
	[COMMITTEE_TABLE]: Map({
		active: List([]),
		backup: List([]),
		locked: false,
		disabledInput: false,
	}),
};

export default createModule({
	name: 'table',
	initialState: Map({
		[HISTORY_TABLE]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_TABLE_FIELDS[HISTORY_TABLE]),
		[PERMISSION_TABLE]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_TABLE_FIELDS[PERMISSION_TABLE]),
		[COMMITTEE_TABLE]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_TABLE_FIELDS[COMMITTEE_TABLE]),
	}),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.table, payload.field], payload.value);

				return state;
			},
		},

		setIn: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.table, ...payload.fields], payload.value);

				return state;
			},
		},

		update: {
			reducer: (state, { payload }) => {
				const path = [payload.table, ...payload.fields];
				const index = state.getIn(path).findIndex((t) => (t.key === payload.param));
				if (index === -1) return state;
				const updatedList = state
					.getIn(path)
					.update(index, (v) => ({ ...v, ...payload.value }));

				state = state.setIn(path, updatedList);

				return state;
			},
		},

		clear: {
			reducer: (state, { payload }) => {
				state = state.set(
					payload.table,
					_.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_TABLE_FIELDS[payload.table]),
				);

				return state;
			},
		},
	},
});
