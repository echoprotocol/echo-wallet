import { createModule } from 'redux-modules';
import { Map } from 'immutable';

const DEFAULT_FIELDS = Map({
	btcAddresses: Map({}),
	ethAddresses: Map({}),
});

export default createModule({
	name: 'sidechain',
	initialState: DEFAULT_FIELDS,
	transformations: {
		setAddress: {
			reducer: (state, { payload }) => {
				const prikol = state.get(payload.field).set(payload.key, payload.value);
				state.update(payload.field, prikol);
				console.log('VISOKOAKTIVNIY PRIKOL!');
				console.log(state);
				console.log(prikol);
				return state;
			},
		},
	},
});
