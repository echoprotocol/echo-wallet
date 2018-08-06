import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';
import _ from 'lodash';

import {
	FORM_SIGN_UP,
	FORM_SIGN_IN,
	FORM_UNLOCK_MODAL,
	FORM_CONTRACT_CONSTANT,
	FORM_CONTRACT_FUNCTION,
	FORM_TRANSFER,
	FORM_CREATE_CONTRACT,
} from '../constants/FormConstants';

const DEFAULT_FIELDS = Map({
	error: null,
	loading: false,
});

const DEFAULT_FORM_FIELDS = {
	[FORM_SIGN_UP]: Map({
		accountName: {
			value: '',
			error: null,
		},
		generatedPassword: {
			value: '',
			error: null,
		},
		confirmPassword: {
			value: '',
			error: null,
		},
		accepted: false,
	}),
	[FORM_SIGN_IN]: Map({
		accountName: {
			value: '',
			error: null,
		},
		password: {
			value: '',
			error: null,
		},
	}),
	[FORM_UNLOCK_MODAL]: Map({
		password: {
			value: '',
			error: null,
		},
	}),
	[FORM_CONTRACT_CONSTANT]: Map({
		constants: List(),
		query: '',
	}),
	[FORM_CONTRACT_FUNCTION]: Map({
		functions: List(),
	}),
	[FORM_TRANSFER]: Map({
		to: {
			value: '',
			loading: false,
			error: null,
			checked: false,
		},
		amount: {
			value: '',
			error: null,
		},
		currency: null,
		fee: {
			value: '',
			asset: null,
			error: null,
		},
		comment: {
			value: '',
			error: null,
		},
	}),
	[FORM_CREATE_CONTRACT]: Map({
		bytecode: {
			value: '',
			error: null,
		},
		accepted: false,
	}),
};

export default createModule({
	name: 'form',
	initialState: Map({
		[FORM_SIGN_UP]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_SIGN_UP]),
		[FORM_SIGN_IN]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_SIGN_IN]),
		[FORM_UNLOCK_MODAL]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_UNLOCK_MODAL]),
		[FORM_CONTRACT_CONSTANT]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_CONTRACT_CONSTANT]),
		[FORM_CONTRACT_FUNCTION]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_CONTRACT_FUNCTION]),
		[FORM_TRANSFER]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_TRANSFER]),
		[FORM_CREATE_CONTRACT]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_CREATE_CONTRACT]),
	}),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.form, payload.field], payload.value);

				return state;
			},
		},

		setIn: {
			reducer: (state, { payload }) => {
				const field = state.getIn([payload.form, payload.field]);

				state = state.setIn([payload.form, payload.field], {
					...field,
					...payload.params,
				});

				return state;
			},
		},

		setFormValue: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.form, 'error'], null);

				const field = state.getIn([payload.form, payload.field]);

				state = state.setIn([payload.form, payload.field], Object.assign({}, field, {
					...field,
					value: payload.value,
					error: null,
				}));

				return state;
			},
		},

		setFormError: {
			reducer: (state, { payload }) => {
				if (payload.field === 'error') {
					state = state.setIn([payload.form, payload.field], payload.value);
				} else {
					const field = state.getIn([payload.form, payload.field]);

					state = state.setIn([payload.form, payload.field], Object.assign({}, field, {
						...field,
						error: payload.value,
					}));
				}

				return state;
			},
		},

		toggleLoading: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.form, 'loading'], !!payload.value);

				return state;
			},
		},


		clearForm: {
			reducer: (state, { payload }) => {
				const form = _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[payload.form]);
				state = state.set(payload.form, form);

				return state;
			},
		},

		clearByField: {
			reducer: (state, { payload }) => {
				const field = _.cloneDeep(DEFAULT_FORM_FIELDS[payload.form].get(payload.field));
				state = state.setIn([payload.form, payload.field], field);

				return state;
			},
		},
		setInside: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.form].concat(payload.fields), payload.value);

				return state;
			},
		},
	},
});
