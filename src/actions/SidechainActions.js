import echo from 'echojs-lib';
import { Map } from 'immutable';
import SidechainReducer from '../reducers/SidechainReducer';

export const getBtcAddress = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	const btcAddress = await echo.api.getBtcAddress(activeUserId);

	dispatch(SidechainReducer.actions.set({
		field: 'btcAddress',
		value: new Map({
			accountId: activeUserId,
			address: btcAddress.deposit_address.address,
		}),
	}));

	return true;
};
