import React from 'react';

import ModalUnlockWallet from './ModalUnlock';
import ModalWatchList from './ModalWatchList';
import ModalTokens from './ModalTokens';
import ModalDetails from './ModalDetails';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<div>
				<ModalWatchList />
				<ModalUnlockWallet />
				<ModalTokens />
				<ModalDetails />
			</div>
		);
	}

}
