import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';
import _ from 'lodash';

import {
	MODAL_UNLOCK,
	MODAL_DETAILS,
	MODAL_TOKENS,
	MODAL_UNLOCK_PERMISSION,
	MODAL_CHOOSE_ACCOUNT,
	MODAL_WIPE,
	MODAL_LOGOUT,
	MODAL_INFO,
	MODAL_ADD_KEY,
	MODAL_SHOW_WIF,
	MODAL_UNLOCK_SHOW_WIF,
	MODAL_EDIT_PERMISSIONS,
	MODAL_ADD_WIF,
	MODAL_VIEW_WIF,
	MODAL_BACKUP,
	MODAL_CONFIRM_EDITING_OF_PERMISSIONS,
} from './../constants/ModalConstants';

const DEFAULT_FIELDS = Map({
	show: false,
	loading: false,
	error: null,
});

const DEFAULT_MODAL_FIELDS = {
	[MODAL_TOKENS]: Map({
		contractId: {
			value: '',
			error: null,
		},
	}),
	[MODAL_UNLOCK]: Map({}),
	[MODAL_UNLOCK_PERMISSION]: Map({}),
	[MODAL_CHOOSE_ACCOUNT]: Map({
		accounts: List([]),
	}),
	[MODAL_WIPE]: Map({}),
	[MODAL_LOGOUT]: Map({
		accountName: '',
	}),
	[MODAL_INFO]: Map({}),
	[MODAL_ADD_KEY]: Map({}),
	[MODAL_SHOW_WIF]: Map({}),
	[MODAL_UNLOCK_SHOW_WIF]: Map({}),
	[MODAL_EDIT_PERMISSIONS]: Map({}),
	[MODAL_ADD_WIF]: Map({}),
	[MODAL_VIEW_WIF]: Map({}),
	[MODAL_BACKUP]: Map({}),
	[MODAL_CONFIRM_EDITING_OF_PERMISSIONS]: Map({}),


};

export default createModule({
	name: 'modal',
	initialState: Map({
		[MODAL_UNLOCK]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_UNLOCK]),
		[MODAL_UNLOCK_PERMISSION]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_MODAL_FIELDS[MODAL_UNLOCK_PERMISSION]),
		[MODAL_DETAILS]: _.cloneDeep(DEFAULT_FIELDS),
		[MODAL_TOKENS]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_TOKENS]),
		[MODAL_WIPE]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_WIPE]),
		[MODAL_CHOOSE_ACCOUNT]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_MODAL_FIELDS[MODAL_CHOOSE_ACCOUNT]),
		[MODAL_LOGOUT]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_LOGOUT]),
		[MODAL_INFO]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_INFO]),
		[MODAL_ADD_KEY]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_ADD_KEY]),
		[MODAL_SHOW_WIF]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_SHOW_WIF]),
		[MODAL_UNLOCK_SHOW_WIF]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_UNLOCK_SHOW_WIF]),
		[MODAL_EDIT_PERMISSIONS]: _
			.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_EDIT_PERMISSIONS]),
		[MODAL_ADD_WIF]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_ADD_WIF]),
		[MODAL_VIEW_WIF]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_VIEW_WIF]),
		[MODAL_BACKUP]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_BACKUP]),
		[MODAL_CONFIRM_EDITING_OF_PERMISSIONS]: _
			.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_CONFIRM_EDITING_OF_PERMISSIONS]),


	}),
	transformations: {
		open: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.type, 'show'], true);

				if (payload.params) {
					Object.entries(payload.params).forEach(([field, value]) => {
						state = state.setIn([payload.type, field], value);
					});
				}

				return state;
			},
		},
		close: {
			reducer: (state, { payload }) => {
				const initialState = _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[payload.type]);
				state = state.set(payload.type, initialState);
				return state;
			},
		},
		reset: {
			reducer: (state, { payload }) => {
				const initialState = _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[payload.type]);
				state = state.set(payload.type, initialState);
				return state;
			},
		},
		toggleLoading: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.type, 'loading'], payload.value);
				return state;
			},
		},
		update: {
			reducer: (state, { payload }) => {

				state = state.setIn([payload.type, payload.param], payload.value);

				return state;
			},
		},
		setParamValue: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.type, 'error'], null);

				const param = state.getIn([payload.type, payload.param]);

				state = state.setIn([payload.type, payload.param], Object.assign({}, param, {
					value: payload.value,
					error: null,
				}));
				return state;
			},
		},
		setParamError: {
			reducer: (state, { payload }) => {
				const param = state.getIn([payload.type, payload.param]);

				state = state.setIn([payload.type, payload.param], Object.assign({}, param, {
					value: param.value,
					error: payload.error,
				}));

				return state;
			},
		},
		setError: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.type, 'error'], payload.error);
				return state;
			},
		},
	},
});
