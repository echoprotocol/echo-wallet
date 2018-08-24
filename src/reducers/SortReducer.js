import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

import { SORT_CONTRACTS } from './../constants/GlobalConstants';

const DEFAULT_FIELDS = Map({
});

const DEFAULT_MODAL_FIELDS = {
	[SORT_CONTRACTS]: Map({
		sortType: 'id',
		sortInc: true,
	}),
};

export default createModule({
	name: 'sort',
	initialState: Map({
		[SORT_CONTRACTS]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[SORT_CONTRACTS]),
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
