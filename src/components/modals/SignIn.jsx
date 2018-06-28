import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'semantic-ui-react';
import { Button, Form } from 'semantic-ui-react'

// import ModalActions from './../../actions/ModalActions';

class SignIn extends React.Component {

	static get propTypes() {
		return {
			show: PropTypes.bool,
		};
	}

	static get defaultProps() {
		return {
			show: true
		};
	}

	onCancel(e) {
		e.preventDefault();
	}

	render() {
		const {
			show
		} = this.props;
		  
		return (
			<Modal className="small" open={show} onClose={(e) => this.onCancel(e)}>
				<div className="modal-content">
					<Form className="user-form">
						<div className="modal-info">
							<h3>Welcome to Echo</h3>
						</div>
						<Form.Field>
							<label>ACCOUNT NAME</label>
							<input  />
						</Form.Field>
						<Form.Field>
							<label>Password or WIF-key</label>
							<input />
						</Form.Field>
						<Button type='submit' color='orange'>Submit</Button>
					</Form>
				</div>
			</Modal>
		);
	}

}

export default connect(
	(state) => ({
	}),
	(dispatch) => ({
	}),
)(SignIn);
