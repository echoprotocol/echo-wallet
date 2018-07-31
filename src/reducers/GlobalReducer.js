import { createModule } from 'redux-modules';
import { Map } from 'immutable';

export default createModule({
	name: 'global',
	initialState: Map({
		globalLoading: true,
		loading: false,
		error: null,
		activeUser: new Map({
			id: '',
			name: '',
		}),
		contracts: new Map({}),
	}),
	transformations: {
		setGlobalLoading: {
			reducer: (state, { payload }) => {
				state = state.set('globalLoading', payload.globalLoading);

				return state;
			},
		},
		setLoading: {
			reducer: (state, { payload }) => {
				state = state.set('loading', !!payload);
				return state;
			},
		},
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
		},
		setIn: {
			reducer: (state, { payload }) => {
				Object.keys(payload.params).forEach((field) => {
					state = state.setIn([payload.field, field], payload.params[field]);
				});

				return state;
			},
		},
		push: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.field, payload.param], payload.value);

				return state;
			},
		},
	},
});
