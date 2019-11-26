import { createModule } from 'redux-modules';
import { Map } from 'immutable';

const DEFAULT_FIELDS = Map({
	btcAddress: new Map(),
	ethAddress: new Map({
		accountId: '',
		address: '',
		isApproved: false,
		isAddressGenerated: false,
	}),
});

export default createModule({
	name: 'sidechain',
	initialState: DEFAULT_FIELDS,
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
		},
	},
});
