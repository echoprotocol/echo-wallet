import React from 'react';

import ModalTokens from './ModalTokens';
import ModalLogout from './ModalLogout';
import ModalWipe from './ModalWipe';
import ModalInfo from './ModalInfo';
import ModalAddProposalWIF from './ModalAddProposalWIF';
import ModalChangeParentAccount from './ModalChangeParentAccount';
import ModalAcceptRunningNode from './ModalAcceptRunningNode';


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
				<ModalAcceptRunningNode />
			</React.Fragment>
		);
	}

}
