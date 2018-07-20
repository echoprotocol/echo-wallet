import React from 'react';

import ModalUnlockWallet from './ModalUnlock';
import ModalAddAssets from './ModalAddAssets';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<div>
				<ModalUnlockWallet />
				<ModalAddAssets />
			</div>
		);
	}

}
