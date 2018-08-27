import { createModule } from 'redux-modules';
import { List } from 'immutable';

const DEFAULT_FIELDS = List();

export default createModule({
	name: 'fee',
	initialState: DEFAULT_FIELDS,
	transformations: {
		set: {
			reducer: (state, { payload }) => new List(payload.value),
		},
	},
});
