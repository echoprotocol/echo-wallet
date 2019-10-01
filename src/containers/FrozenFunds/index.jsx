import { connect } from 'react-redux';
import { CACHE_MAPS } from 'echojs-lib';

import FrozenFunds from '../../components/FrozenFunds';
import { ECHO_ASSET_ID } from '../../constants/GlobalConstants';

export default connect((state) => ({
	frozenFunds: state.balance.get('frozenFunds').toJS(),
	totalFrozenFunds: state.balance.get('totalFrozenFunds'),
	coreAsset: state.echojs.getIn([CACHE_MAPS.ASSET_BY_ASSET_ID, ECHO_ASSET_ID]).toJS(),
}))(FrozenFunds);

