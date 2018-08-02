import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

import HISTORY_DATA from '../constants/TableConstants';

const DEFAULT_FIELDS = {
	[HISTORY_DATA]: Map({
		history: null,
	}),
};

export default createModule({
	name: 'table',
	initialState: Map(_.cloneDeep(DEFAULT_FIELDS)),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.table, payload.field], payload.value);

				return state;
			},
		},

		clear: {
			reducer: (state, { payload }) => {
				state = state.set([payload.table], DEFAULT_FIELDS[payload.table]);

				return state;
			},
		},
	},
});
