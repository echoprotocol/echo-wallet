import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';
import _ from 'lodash';

import {
	MODAL_UNLOCK,
	MODAL_DETAILS,
	MODAL_TOKENS,
	MODAL_UNLOCK_PERMISSION,
	MODAL_CHOOSE_ACCOUNT,
} from './../constants/ModalConstants';

const DEFAULT_FIELDS = Map({
	show: false,
	disabled: false,
});

const DEFAULT_MODAL_FIELDS = {
	[MODAL_TOKENS]: Map({
		contractId: {
			value: '',
			error: null,
		},
		error: null,
	}),
	[MODAL_UNLOCK]: Map({
		role: null,
		publicKey: null,
	}),
	[MODAL_UNLOCK_PERMISSION]: Map({
		role: null,
		publicKey: null,
	}),
	[MODAL_CHOOSE_ACCOUNT]: Map({
		accounts: List([]),
	}),
};

export default createModule({
	name: 'modal',
	initialState: Map({
		[MODAL_UNLOCK]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_UNLOCK]),
		[MODAL_UNLOCK_PERMISSION]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_MODAL_FIELDS[MODAL_UNLOCK_PERMISSION]),
		[MODAL_DETAILS]: _.cloneDeep(DEFAULT_FIELDS),
		[MODAL_TOKENS]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_TOKENS]),
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
		setDisable: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.type, 'disabled'], payload.value);
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
