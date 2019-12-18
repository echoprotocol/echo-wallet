import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';
import _ from 'lodash';

import {
	FORM_SIGN_UP,
	FORM_SIGN_IN,
	FORM_UNLOCK_MODAL,
	FORM_TRANSFER,
	FORM_CREATE_CONTRACT_SOURCE_CODE,
	FORM_CREATE_CONTRACT_BYTECODE,
	FORM_CREATE_CONTRACT_OPTIONS,
	FORM_CALL_CONTRACT,
	FORM_ADD_CONTRACT,
	FORM_VIEW_CONTRACT,
	FORM_CALL_CONTRACT_VIA_ID,
	FORM_ADD_CUSTOM_NETWORK,
	FORM_PERMISSION_KEY,
	FORM_COMMITTEE,
	FORM_PASSWORD_CREATE,
	FORM_FREEZE,
	FORM_BTC_RECEIVE,
	FORM_ETH_RECEIVE,
	FORM_SIGN_UP_OPTIONS,
	SIGN_UP_OPTIONS_TYPES,
	FORM_CHANGE_DELEGATE,
	FORM_REPLENISH,
	FORM_TO_WHITELIST,
} from '../constants/FormConstants';

import { FREEZE_BALANCE_PARAMS } from '../constants/GlobalConstants';
import { SOURCE_CODE_MODE, SUPPORTED_ASSET_ALL } from '../constants/ContractsConstants';

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
		generatedWIF: {
			value: '',
			error: null,
		},
		confirmWIF: {
			value: '',
			error: null,
		},
		userWIF: {
			value: '',
			error: null,
		},
		userPublicKey: {
			value: '',
			error: null,
		},
		isCustomWIF: false,
		accepted: false,
	}),
	[FORM_SIGN_IN]: Map({
		accountName: {
			value: '',
			error: null,
		},
		wif: {
			value: '',
			error: null,
		},
	}),
	[FORM_SIGN_UP_OPTIONS]: Map({
		isMoreOptionsActive: false,
		optionType: SIGN_UP_OPTIONS_TYPES.DEFAULT,
		registrarAccount: {
			value: '',
			error: null,
		},
		ipOrUrl: {
			value: '',
			error: null,
		},
	}),
	[FORM_UNLOCK_MODAL]: Map({
		password: {
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
		from: {
			value: '',
			loading: false,
			error: null,
			checked: false,
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
		balance: {
			assets: new List([]),
		},
		additionalAccountInfo: '',
		isAvailableBalance: false,
		subjectTransferType: '',
		avatarName: '',
	}),
	[FORM_ETH_RECEIVE]: Map({
		amount: {
			value: '',
			error: null,
		},
		currency: null,
		balance: {
			assets: new List([]),
		},
		isAvailableBalance: false,
	}),
	[FORM_BTC_RECEIVE]: Map({
		amount: {
			value: '',
			error: null,
		},
		currency: null,
		balance: {
			assets: new List([]),
		},
		isAvailableBalance: false,
	}),
	[FORM_CREATE_CONTRACT_SOURCE_CODE]: Map({
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
		code: {
			value: '',
			error: null,
		},
		contracts: new Map({}),
		compilersList: new Map({}),
		currentCompiler: {
			value: '',
			error: null,
		},
		compileLoading: false,
		annotations: [],
		editorWorker: false,
	}),
	[FORM_CREATE_CONTRACT_BYTECODE]: Map({
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
	}),
	[FORM_CREATE_CONTRACT_OPTIONS]: Map({
		amount: {
			value: '',
			error: null,
		},
		isAvailableBalance: false,
		ETHAccuracy: false,
		supportedAsset: {
			value: '',
			error: null,
		},
		supportedAssetRadio: SUPPORTED_ASSET_ALL,
		contractMode: SOURCE_CODE_MODE,
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
		feeError: null,
		isAvailableBalance: false,
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
		isAvailableBalance: false,
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
	[FORM_PERMISSION_KEY]: Map({
		active: new Map({
			keys: Map({}),
			accounts: Map({}),
			threshold: {
				value: null,
				error: null,
			},
		}),
		echoRand: new Map({
			keys: Map({}),
		}),
		firstFetch: false,
		isChanged: false,
		isEditMode: false,
	}),
	[FORM_COMMITTEE]: new Map({
		votes: List([]),
		canceled: List([]),
		votingAccountId: null,
		proxyAccountId: null,
		accountLoading: false,
		disabled: false,
		account: {
			value: '',
			error: null,
		},
	}),
	[FORM_PASSWORD_CREATE]: Map({}),
	[FORM_FREEZE]: Map({
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
		balance: {
			assets: new List([]),
		},
		duration: {
			value: FREEZE_BALANCE_PARAMS[0].duration,
			text: FREEZE_BALANCE_PARAMS[0].durationText,
			isSelected: false,
		},
		isAvailableBalance: false,
	}),
	[FORM_CHANGE_DELEGATE]: Map({
		delegate: {
			value: '',
			error: null,
		},
	}),
	[FORM_REPLENISH]: Map({
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
		balance: {
			assets: new List([]),
		},
		isAvailableBalance: false,
	}),
	[FORM_TO_WHITELIST]: Map({
		account: {
			value: '',
			loading: false,
			error: null,
			checked: false,
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
		[FORM_CREATE_CONTRACT_SOURCE_CODE]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_CREATE_CONTRACT_SOURCE_CODE]),
		[FORM_CREATE_CONTRACT_BYTECODE]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_CREATE_CONTRACT_BYTECODE]),
		[FORM_CREATE_CONTRACT_OPTIONS]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_CREATE_CONTRACT_OPTIONS]),
		[FORM_CALL_CONTRACT]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_CALL_CONTRACT]),
		[FORM_ADD_CONTRACT]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_ADD_CONTRACT]),
		[FORM_VIEW_CONTRACT]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_VIEW_CONTRACT]),
		[FORM_CALL_CONTRACT_VIA_ID]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_CALL_CONTRACT_VIA_ID]),
		[FORM_ADD_CUSTOM_NETWORK]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_ADD_CUSTOM_NETWORK]),
		[FORM_PERMISSION_KEY]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_PERMISSION_KEY]),
		[FORM_COMMITTEE]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_COMMITTEE]),
		[FORM_PASSWORD_CREATE]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_PASSWORD_CREATE]),
		[FORM_FREEZE]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_FREEZE]),
		[FORM_REPLENISH]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_REPLENISH]),
		[FORM_ETH_RECEIVE]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_FORM_FIELDS[FORM_ETH_RECEIVE]),
		[FORM_SIGN_UP_OPTIONS]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_SIGN_UP_OPTIONS]),
		[FORM_CHANGE_DELEGATE]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_CHANGE_DELEGATE]),
		[FORM_TO_WHITELIST]: _.cloneDeep(DEFAULT_FIELDS)
			.merge(DEFAULT_FORM_FIELDS[FORM_TO_WHITELIST]),
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

				const list = state.getIn([payload.form, payload.field]).push(payload.value);

				state = state.setIn([payload.form, payload.field], list);

				return state;
			},
		},

		deleteValue: {
			reducer: (state, { payload }) => {
				const index = state.getIn([payload.form, payload.field]).indexOf(payload.value);

				state = state.deleteIn([payload.form, payload.field, index]);

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

		removeKey: {
			reducer: (state, { payload }) => {
				const path = [payload.form].concat(payload.fields);

				state = state.deleteIn(path);

				return state;
			},
		},
	},
});
