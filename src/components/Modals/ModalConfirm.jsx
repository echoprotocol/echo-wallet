import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'semantic-ui-react';

import ModalActions from './../../actions/ModalActions';

class ModalConfirm extends React.Component {

	render() {

		return (
			<Modal className="small" />
		);
	}

}

export default connect(
	(state) => ({
		show: state.modal.getIn(['show']),
	}),
	(dispatch) => ({
		closeConfirm: () => dispatch(ModalActions.closeConfirm()),
	}),
)(ModalConfirm);
