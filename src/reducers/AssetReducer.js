import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

const DEFAULT_FIELDS = {
	asset: Map({
		balance: 0,
		symbol: '',
		precision: 0,
	}),
};

export default createModule({
	name: 'asset',
	initialState: Map(_.cloneDeep(DEFAULT_FIELDS)),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.asset, payload.field], payload.value);

				return state;
			},
		},

	},
});
