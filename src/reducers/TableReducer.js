import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

const DEFAULT_FIELDS = {
	activityBodyTable: Map({
		history: null,
	}),
};

export default createModule({
	name: 'table',
	initialState: Map(_.cloneDeep(DEFAULT_FIELDS)),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.form, payload.field], payload.value);

				return state;
			},
		},

	},
});
