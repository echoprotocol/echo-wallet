import echo from 'echojs-lib';
import { Map } from 'immutable';
import SidechainReducer from '../reducers/SidechainReducer';

export const getBtcAddress = () => async (dispatch, getState) => {
	const activeUserId = getState().global.getIn(['activeUser', 'id']);

	if (!activeUserId) {
		return false;
	}

	const btcAddress = await echo.api.getBtcAddress(activeUserId);

	if (!btcAddress) {
		return false;
	}
	console.log('at GET BTC ADDRESS', btcAddress)
	dispatch(SidechainReducer.actions.set({
		field: 'btcAddress',
		value: new Map({
			id: btcAddress.id,
			address: btcAddress.deposit_address.address,
			isAvailable: btcAddress.is_relevant,
		}),
	}));

	return true;
};
