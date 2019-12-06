import React from 'react';

import ModalTokens from './ModalTokens';
import ModalLogout from './ModalLogout';
import ModalWipe from './ModalWipe';
import ModalInfo from './ModalInfo';
import ModalAddProposalWIF from './ModalAddProposalWIF';
import ModalChangeParentAccount from './ModalChangeParentAccount';
import ModalToWhitelist from './ModalToWhitelist';
import ModalToBlacklist from './ModalToBlacklist';
import ModalReplenish from './ModalReplenish';
import ModalWhitelist from './ModalWhitelist';

export default class ModalsComponent extends React.Component {

	render() {
		return (
			<React.Fragment>
				<ModalTokens />
				<ModalLogout />
				<ModalWipe />
				<ModalInfo />
				<ModalAddProposalWIF />
				<ModalChangeParentAccount />
				<ModalToWhitelist />
				<ModalToBlacklist />
				<ModalReplenish />
				<ModalWhitelist />
			</React.Fragment>
		);
	}

}
