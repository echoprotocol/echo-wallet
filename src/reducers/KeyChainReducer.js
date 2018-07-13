import { createModule } from 'redux-modules';
import { Map } from 'immutable';


const initialState = new Map({
	storage: new Map({}),
	properties: new Map({
		mode: 'lock',
		timeoutId: null,
	}),
});

export default createModule({
	name: 'keychain',
	initialState,
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.setIn(['storage', payload.key], payload.value);

				return state;
			},
		},

		remove: {
			reducer: (state, { payload }) => {
				state = state.setIn(['storage', payload.key], null);

				return state;
			},
		},
		reset: {
			reducer: (state) => {
				state = initialState;
				return state;
			},
		},
		setMode: {
			reducer: (state, { payload }) => {
				state = state.setIn(['properties', 'mode'], payload.mode);

				return state;
			},
		},
		setTimeout: {
			reducer: (state, { payload }) => {
				state = state.setIn(['properties', 'timeoutId'], payload.timeoutId);

				return state;
			},
		},
	},
});
