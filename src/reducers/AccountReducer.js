import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

const DEFAULT_FIELDS = {
	account: Map({
		balances: null,
		symbol: null,
	}),
};

export default createModule({
	name: 'account',
	initialState: Map(_.cloneDeep(DEFAULT_FIELDS)),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.account, payload.field], payload.value);

				return state;
			},
		},

	},
});
