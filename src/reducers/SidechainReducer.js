import { createModule } from 'redux-modules';
import { Map } from 'immutable';

const DEFAULT_FIELDS = Map({
	btcAddress: new Map({
		id: '',
		address: '',
		isAvailable: false,
	}),
	ethAddress: new Map({}),
});

export default createModule({
	name: 'sidechain',
	initialState: DEFAULT_FIELDS,
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				console.log('AT REDUCER', state);
				state = state.set(payload.field, payload.value);

				return state;
			},
		},
	},
});
