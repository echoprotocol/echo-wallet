import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

import { MODAL_UNLOCK, MODAL_WATCH_LIST, MODAL_DETAILS, MODAL_TOKENS } from './../constants/ModalConstants';

const DEFAULT_FIELDS = Map({
	show: false,
});

const DEFAULT_MODAL_FIELDS = {
	[MODAL_TOKENS]: Map({
		address: '',
		error: null,
	}),
};

export default createModule({
	name: 'modal',
	initialState: Map({
		[MODAL_UNLOCK]: _.cloneDeep(DEFAULT_FIELDS).merge({
			title: null,
			content: null,
			btnTitleSuccess: null,
			btnTitleCancel: null,
		}),
		[MODAL_WATCH_LIST]: DEFAULT_FIELDS,
		currentOpens: [],
		[MODAL_DETAILS]: _.cloneDeep(DEFAULT_FIELDS),
		[MODAL_TOKENS]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_TOKENS]),
	}),
	transformations: {
		open: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.type, 'show'], true);
				return state;
			},
		},
		close: {
			reducer: (state, { payload }) => {
				state = state.set(payload.type, DEFAULT_MODAL_FIELDS[payload.type]);
				return state;
			},
		},
		setParam: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.type, payload.param], payload.value);
				return state;
			},
		},
	},
});
