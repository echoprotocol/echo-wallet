import { createModule } from 'redux-modules';
import { Map } from 'immutable';

const DEFAULT_FIELDS = Map({
	options: null,
	operation: '',
	keys: null,
	showOptions: null,
	comment: {
		value: '',
		unlocked: false,
		error: null,
	},
});

export default createModule({
	name: 'transaction',
	initialState: DEFAULT_FIELDS,
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
		},
		setIn: {
			reducer: (state, { payload }) => {
				state = state.setIn(payload.fields, payload.value);

				return state;
			},
		},
		reset: {
			reducer: (state) => {
				state = DEFAULT_FIELDS;

				return state;
			},
		},
		setOperation: {
			reducer: (state, { payload }) => {
				state = state.set('operation', payload.operation);
				state = state.set('options', new Map(payload.options));
				state = state.set('showOptions', new Map(payload.showOptions));

				return state;
			},
		},
		setComment: {
			reducer: (state, { payload }) => {
				const comment = DEFAULT_FIELDS.get('comment');

				state = state.set('comment', {
					value: payload.comment ? payload.comment : comment.value,
					unlocked: payload.unlocked ? payload.unlocked : comment.unlocked,
					error: payload.error ? payload.error : comment.error,
				});

				return state;
			},
		},
	},
});
