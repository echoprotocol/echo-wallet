import React from 'react';

import ModalTokens from './ModalTokens';
import ModalLogout from './ModalLogout';
import ModalChooseAccount from './ModalChooseAccount';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<div>
				<ModalTokens />
				<ModalLogout />
				<ModalChooseAccount />
			</div>
		);
	}

}
