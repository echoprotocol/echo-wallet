import React from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusLock from 'react-focus-lock';
import { injectIntl } from 'react-intl';

import { closeModal } from '../../actions/ModalActions';
import { MODAL_NODE_COMING_SOON } from '../../constants/ModalConstants';

class ModalComingSoon extends React.Component {

	onClose(e) {
		e.preventDefault();
		this.props.close();
	}

	render() {
		const { show, intl } = this.props;
		return (
			<Modal className="modal-wrap" open={show}>
				<FocusLock autoFocus={false}>
					<button
						className="icon-close"
						onClick={(e) => this.onClose(e)}
					/>

					<div className="modal-header">
						<h3 className="modal-header-title">
							{intl.formatMessage({ id: 'modals.modal_node_coming_soon.title' })}
						</h3>
					</div>
					<div className="modal-body">
						<div className="info-text">
							{intl.formatMessage({ id: 'modals.modal_node_coming_soon.text' })}
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalComingSoon.propTypes = {
	show: PropTypes.bool,
	close: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};

ModalComingSoon.defaultProps = {
	show: false,
};


export default injectIntl(connect(
	(state) => ({
		show: state.modal.getIn([MODAL_NODE_COMING_SOON, 'show']),
	}),
	(dispatch) => ({
		close: () => dispatch(closeModal(MODAL_NODE_COMING_SOON)),
	}),
)(ModalComingSoon));

