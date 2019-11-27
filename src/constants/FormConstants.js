export const FORM_SIGN_UP = 'sign_up';
export const FORM_SIGN_IN = 'sign_in';
export const FORM_UNLOCK_MODAL = 'unlock_modal';
export const FORM_TRANSFER = 'transfer';
export const FORM_CREATE_CONTRACT = 'create_contract';
export const FORM_CALL_CONTRACT = 'contract_call';
export const FORM_ADD_CONTRACT = 'add_contract';
export const FORM_VIEW_CONTRACT = 'view_contract';
export const FORM_CALL_CONTRACT_VIA_ID = 'call_contract_via_id';
export const FORM_ADD_CUSTOM_NETWORK = 'add_custom_network';
export const FORM_PERMISSION_KEY = 'permission_key';
export const FORM_PASSWORD_CREATE = 'password_create';
export const FORM_COMMITTEE = 'committee_key';
export const FORM_FREEZE = 'freeze_amount';
export const FORM_ETH_RECEIVE = 'eth_receive';

export const FORM_SIGN_UP_CHECKBOX_1 = 'I understand that I will lose access to my funds if I loose my WIF';
export const FORM_SIGN_UP_CHECKBOX_2 = 'I understand no one can recover my WIF if I lose or forget it';
export const FORM_SIGN_UP_CHECKBOX_3 = 'I have written down or otherwise stored my WIF';

export const FORM_PERMISSION_ACTIVE_TABLE_TITLE = 'Public Keys and Accounts';
export const FORM_PERMISSION_ACTIVE_TABLE_DESCRIPTION = `Making a backup of your keys helps ensure you can always maintain access to your funds. Anyone having access to your keys will take full control of the funds, so we 
strongly recommend storing it offline in a secure place.`;
export const FORM_PERMISSION_ACTIVE_TABLE_TOOLTIP_TEXT = 'You can split authority to sign a transaction by setting threshold. Total weight of all the keys in the wallet must be equal or more than threshold to sign a transaction.';
export const FORM_PERMISSION_ECHO_RAND_TABLE_TITLE = 'EchoRand Key';
export const FORM_PERMISSION_ECHO_RAND_TABLE_DESCRIPTION = 'EchoRand Key is used for participating in blocks generation and signing sidechain transactions by committee members.';
export const FORM_PERMISSION_ECHO_RAND_TABLE_LINK_TEXT = ' Know more in Echo Docs';
export const FORM_PERMISSION_ECHO_RAND_TABLE_LINK_URL = 'https://docs.echo.org/';
export const FORM_PERMISSION_ECHO_RAND_TABLE_ADVANCED_TEXT = '(for advanced users)';

export const FORM_PERMISSION_EDIT_MODE_ACTIVE_TABLE_DESCRIPTION = 'The settings below allow you to specify the keys and / or accounts, whose signatures will be necessary to send a transaction from your account. Using threshold and weight you can separate access to an account between several keys and / or accounts.';

export const ADD_ACCOUNT_BUTTON_TEXT = 'Add Account';
export const ADD_ACCOUNT_BUTTON_TOOLTIP_TEXT = 'Grant access for sending transactions to another account';
export const ADD_PUBLIC_KEY_BUTTON_TEXT = 'Add public key';
export const ADD_PUBLIC_KEY_BUTTON_TOOLTIP_TEXT = 'Add an additional key to sign transactions';
export const FORM_PERMISSION_MODE_EDIT = 'edit';
export const FORM_PERMISSION_MODE_VIEW = 'view';
export const FORM_PERMISSION_TRESHOLD_SUM_ERROR = "Sum of the keys weight can't be less than threshold";
export const REPEATING_KEYS_ERROR = 'You have this key already';
