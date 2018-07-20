import React from 'react';

import ModalUnlockWallet from './ModalUnlock';
import ModalWatchList from './ModalWatchList';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<div>
				<ModalWatchList />
				<ModalUnlockWallet />
			</div>
		);
	}

}
