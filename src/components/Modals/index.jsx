import React from 'react';

import ModalTokens from './ModalTokens';
import ModalLogout from './ModalLogout';
import ModalWipe from './ModalWipe';
import ModalInfo from './ModalInfo';
import ModalAddProposalWIF from './ModalAddProposalWIF';
import ModalERC20ToWatchList from './ModalERC20ToWatchList';
import ModalChangeParentAccount from './ModalChangeParentAccount';
import ModalWhitelist from './ModalWhitelist';
import ModalBlacklist from './ModalBlacklist';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<React.Fragment>
				<ModalTokens />
				<ModalLogout />
				<ModalWipe />
				<ModalInfo />
				<ModalAddProposalWIF />
				<ModalERC20ToWatchList />
				<ModalChangeParentAccount />
				<ModalWhitelist />
				<ModalBlacklist />
			</React.Fragment>
		);
	}

}
