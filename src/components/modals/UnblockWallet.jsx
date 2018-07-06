import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';

export default class ModalUnblockWallet extends React.Component {

	render() {
		return (
			<Modal className="small" open>
				<div className="modal-content">

					<span className="icon-close" />
					<div className="modal-header" />
					<div className="modal-body">
						<Form className="user-form">
							<div className="form-info">
								<h3>Welcome to Echo</h3>
							</div>
							<div className="field-wrap">
								<Form.Field>
									<label htmlFor="Password">Password</label>
									<input placeholder="Password" />
								</Form.Field>
							</div>
							<Button basic type="submit" color="orange">Unblock Wallet</Button>
							{/* FOR BUTTON WHITOUT LOADING:
								<Button type="submit" color="orange" className="load">Loading...</Button>
							*/}
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}
