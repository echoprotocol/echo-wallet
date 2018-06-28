import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'semantic-ui-react';

import ModalActions from './../../actions/ModalActions';

class ModalConfirm extends React.Component {

	static get propTypes() {
		return {
			show: PropTypes.bool,
			title: PropTypes.string.isRequired,
			text: PropTypes.string,
			callbackYes: PropTypes.func.isRequired,
			callbackCancel: PropTypes.func.isRequired,
			closeConfirm: PropTypes.func,
			btnYes: PropTypes.string,
			btnNo: PropTypes.string,
		};
	}

	static get defaultProps() {
		return {
			show: true,
			btnYes: 'Ok',
			btnNo: 'Cancel',
			text: '',
			closeConfirm: () => {},
		};
	}

	onYes(e) {
		e.preventDefault();

		if (this.props.callbackYes && typeof this.props.callbackYes === 'function') { this.props.callbackYes(); }

		this.props.closeConfirm();
	}

	onCancel(e) {
		e.preventDefault();

		if (this.props.callbackCancel && typeof this.props.callbackCancel === 'function') { this.props.callbackCancel(); }

		this.props.closeConfirm();
	}

	render() {
		const {
			show, title, text, btnYes, btnNo,
		} = this.props;

		return (
			<Modal className="md" open={show} onClose={(e) => this.onCancel(e)}>
				<div className="modal__content">
					<span className="modal__title">{title}</span>
					<div className="modal__txt">
						<p>{text}</p>
					</div>
					<div className="modal__footer">
						<a href="" onClick={(e) => this.onYes(e)} className="btn btn-def tiny">{btnYes}</a>
						<a href="" onClick={(e) => this.onCancel(e)} className="btn btn-def red tiny">{btnNo}</a>
					</div>
				</div>
			</Modal>
		);
	}

}

export default connect(
	(state) => ({
		show: state.modal.getIn(['confirm', 'show']),
		title: state.modal.getIn(['confirm', 'title']),
		text: state.modal.getIn(['confirm', 'text']),
		btnYes: state.modal.getIn(['confirm', 'btnYes']),
		btnNo: state.modal.getIn(['confirm', 'btnNo']),
		callbackYes: state.modal.getIn(['confirm', 'callbackYes']),
		callbackCancel: state.modal.getIn(['confirm', 'callbackCancel']),
	}),
	(dispatch) => ({
		closeConfirm: () => dispatch(ModalActions.closeConfirm()),
	}),
)(ModalConfirm);
