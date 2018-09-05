import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

import { HISTORY } from '../constants/TableConstants';

const DEFAULT_FIELDS = Map({
	data: null,
	loading: false,
	error: null,
});

export default createModule({
	name: 'table',
	initialState: Map({
		[HISTORY]: _.cloneDeep(DEFAULT_FIELDS),
	}),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.table, payload.field], payload.value);

				return state;
			},
		},

		clear: {
			reducer: (state, { payload }) => {
				state = state.set(payload.table, _.cloneDeep(DEFAULT_FIELDS));

				return state;
			},
		},
	},
});
