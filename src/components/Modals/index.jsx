import React from 'react';

import ModalTokens from './ModalTokens';
import ModalLogout from './ModalLogout';


export default class ModalsComponent extends React.Component {

	render() {
		return (
			<div>
				<ModalTokens />
				<ModalLogout />
			</div>
		);
	}

}
