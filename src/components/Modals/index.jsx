import React from 'react';

import ModalUnlockWallet from './ModalUnlock';
import ModalTokens from './ModalTokens';
import ModalDetails from './ModalDetails';
import ModalWatchList from './ModalWatchList';

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
