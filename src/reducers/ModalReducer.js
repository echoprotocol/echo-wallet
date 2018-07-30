import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

import { MODAL_UNLOCK, MODAL_DETAILS } from './../constants/ModalConstants';

const DEFAULT_FIELDS = Map({
	show: false,
});

export default createModule({
	name: 'modal',
	initialState: Map({
		[MODAL_UNLOCK]: _.cloneDeep(DEFAULT_FIELDS).merge({
			title: null,
			content: null,
			btnTitleSuccess: null,
			btnTitleCancel: null,
		}),
		[MODAL_DETAILS]: _.cloneDeep(DEFAULT_FIELDS).merge({
			// TODO remove useless fields
			title: null,
			content: null,
			btnTitleSuccess: null,
			btnTitleCancel: null,
		}),
		currentOpens: [],
	}),
	transformations: {
		open: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.type, 'show'], true);
				const currentOpens = state.get('currentOpens');
				currentOpens.push(payload.type);
				state = state.set('currentOpens', currentOpens);
				return state;
			},
		},
		close: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.type, 'show'], false);
				const currentOpens = state.get('currentOpens');
				currentOpens.splice(currentOpens.length - 1, 1);
				state = state.set('currentOpens', currentOpens);
				return state;
			},
		},
	},
});
