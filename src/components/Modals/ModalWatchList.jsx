import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/ModalActions';

import { MODAL_WATCH_LIST } from './../../constants/ModalConstants';

class ModalWatchList extends React.Component {

	onClose(e) {
		e.preventDefault();
		this.props.closeModal();
	}

	render() {
		const { show } = this.props;
		return (
			<Modal className="small" open={show} dimmer="inverted">
				<div className="modal-content">

					<span
						className="icon-close"
						onClick={(e) => this.onClose(e)}
						onKeyDown={(e) => this.onClose(e)}
						role="button"
						tabIndex="0"
					/>
					<div className="modal-header" />
					<div className="modal-body">
						<Form className="user-form">
							<div className="form-info">
								<h3>Add contract to watch list</h3>
							</div>
							<div className="field-wrap">
								<Form.Field>
									<label htmlFor="Adress">Adress</label>
									<div className="">
										<input type="text" placeholder="Contract adress" name="adress" className="ui input" value="" />
										<span className="error-message" />
									</div>
								</Form.Field>
							</div>
							<Button basic type="submit" color="orange">Watch Contract</Button>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalWatchList.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
};

ModalWatchList.defaultProps = {
	show: false,
};

export default connect(
	(state) => {
		console.log(state);
		return { show: state.modal.getIn([MODAL_WATCH_LIST, 'show']) };
	},
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_WATCH_LIST)),
	}),
)(ModalWatchList);
