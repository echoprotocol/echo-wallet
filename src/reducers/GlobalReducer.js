import { createModule } from 'redux-modules';
import { Map } from 'immutable';

export default createModule({
	name: 'global',
	initialState: Map({
		globalLoading: true,
		loading: false,

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
	},
});
