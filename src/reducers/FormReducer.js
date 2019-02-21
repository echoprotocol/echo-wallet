import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

import {
	FORM_SIGN_UP,
	FORM_SIGN_IN,
	FORM_UNLOCK_MODAL,
	FORM_TRANSFER,
	FORM_CREATE_CONTRACT,
	FORM_CALL_CONTRACT,
	FORM_ADD_CONTRACT,
	FORM_VIEW_CONTRACT,
	FORM_CALL_CONTRACT_VIA_ID,
	FORM_ADD_CUSTOM_NETWORK,
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
		selectedSymbol: '',
		note: {
			value: '',
			error: null,
		},
	}),
	[FORM_CREATE_CONTRACT]: Map({
		bytecode: {
			value: '',
			error: null,
		},
		name: {
			value: '',
			error: null,
		},
		abi: {
			value: '',
			error: null,
		},
		addToWatchList: false,
		accepted: false,
	}),
	[FORM_CALL_CONTRACT]: Map({
		inputs: new Map({}),
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
		functionName: '',
		payable: false,
	}),
	[FORM_ADD_CONTRACT]: Map({
		name: {
			value: '',
			error: null,
		},
		id: {
			value: '',
			error: null,
		},
		abi: {
			value: '',
			error: null,
		},
		error: null,
	}),
	[FORM_VIEW_CONTRACT]: Map({
		inputs: new Map({}),
		newName: {
			value: '',
			error: null,
		},
		error: null,
	}),
	[FORM_CALL_CONTRACT_VIA_ID]: Map({
		id: {
			value: '',
			error: null,
		},
		bytecode: {
			value: '',
			error: null,
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
	}),
	[FORM_ADD_CUSTOM_NETWORK]: Map({
		address: {
			value: '',
			error: null,
		},
		name: {
			value: '',
			error: null,
		},
		autoswitch: {
			value: false,
		},
	}),
};

export default createModule({
	name: 'form',
	initialState: Map({
		[FORM_SIGN_UP]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_SIGN_UP]),
		[FORM_SIGN_IN]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_SIGN_IN]),
		[FORM_UNLOCK_MODAL]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_UNLOCK_MODAL]),
		[FORM_TRANSFER]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_TRANSFER]),
		[FORM_CREATE_CONTRACT]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_CREATE_CONTRACT]),
		[FORM_CALL_CONTRACT]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_CALL_CONTRACT]),
		[FORM_ADD_CONTRACT]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_ADD_CONTRACT]),
		[FORM_VIEW_CONTRACT]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_VIEW_CONTRACT]),
		[FORM_CALL_CONTRACT_VIA_ID]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_CALL_CONTRACT_VIA_ID]),
		[FORM_ADD_CUSTOM_NETWORK]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_ADD_CUSTOM_NETWORK]),
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

		push: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.field, payload.param], payload.value);

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

		setError: {
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

		setInFormValue: {
			reducer: (state, { payload }) => {
				const path = [payload.form].concat(payload.fields);

				let field = state.getIn(path) || {};

				if (field.toJS) field = field.toJS();

				state = state.setIn(path, Object.assign({}, field, {
					...field,
					value: payload.value,
					error: null,
				}));

				return state;
			},
		},

		setInFormError: {
			reducer: (state, { payload }) => {
				const path = [payload.form].concat(payload.fields);

				let field = state.getIn(path);
				if (field.toJS) field = field.toJS();
				state = state.setIn(path, Object.assign({}, field, {
					...field,
					error: payload.value,
				}));

				return state;
			},
		},

		setInFormErrorConstant: {
			reducer: (state, { payload }) => {
				const path = [payload.form].concat(payload.fields);

				const field =
					state.toJS()[payload.form][payload.fields[0]][payload.fields[1]][payload.fields[2]];
				state = state.setIn(path, Object.assign({}, field, {
					...field,
					error: payload.value,
				}));

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
	},
});
