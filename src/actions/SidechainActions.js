import echo from 'echojs-lib';
import { Map } from 'immutable';
import SidechainReducer from '../reducers/SidechainReducer';

export const getEthAddress = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	const ethAddress = await echo.api.getEthAddress(activeUserId);

	const result = ethAddress || {
		accountId: activeUserId,
		address: '',
		is_approved: false,
		isAddressGenerated: false,
	};

	const [fullAccount] = await echo.api.getFullAccounts([activeUserId]);

	console.log('ethAddress ', JSON.stringify(ethAddress));

	if (!fullAccount) {
		return false;
	}

	result.isAddressGenerated = fullAccount.statistics.generated_eth_address;

	dispatch(SidechainReducer.actions.set({
		field: 'ethAddress',
		value: new Map({
			accountId: activeUserId,
			address: result.eth_addr,
			isApproved: result.is_approved,
			isAddressGenerated: result.isAddressGenerated,
		}),
	}));

	return true;
};
