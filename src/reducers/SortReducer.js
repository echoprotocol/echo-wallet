import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

import { SORT_CONTRACTS, SORT_ACCOUNTS } from './../constants/GlobalConstants';

const DEFAULT_FIELDS = Map({
});

const DEFAULT_MODAL_FIELDS = {
	[SORT_CONTRACTS]: Map({
		sortType: 'id',
		sortInc: true,
	}),
	[SORT_ACCOUNTS]: Map({
		sortType: 'name',
		sortInc: true,
	}),
};

export default createModule({
	name: 'sort',
	initialState: Map({
		[SORT_CONTRACTS]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[SORT_CONTRACTS]),
		[SORT_ACCOUNTS]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[SORT_ACCOUNTS]),
	}),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.container, new Map(payload.value));
				return state;
			},
		},
	},
});
