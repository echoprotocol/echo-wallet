import echo from 'echojs-lib';
import { Map } from 'immutable';
import SidechainReducer from '../reducers/SidechainReducer';

export const getBtcAddress = () => async (dispatch, getState) => {
	console.log('ACTIVIRUY PRIKOL!!!!');
	const activeUserId = getState().global.getIn(['activeUser', 'id']);


	if (!activeUserId) {
		return false;
	}

	dispatch(SidechainReducer.actions.setAddress({ field: 'btcAddresses', value: new Map(await echo.api.getBtcAddress(activeUserId)) }));
	return true;
};
