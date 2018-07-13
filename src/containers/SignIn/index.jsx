import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Footer from '../../components/Footer/index';
import { openUnlockModal } from '../../actions/ModalActions';

class SignIn extends React.Component {

	onSubmit(e) {
		e.preventDefault();
	}

	lockAccount() {
		this.props.openUnlockModal();
	}

	render() {
		return (
			<Segment basic className="wrapper">
				<div className="content center-mode ">
					<div>
						<Form className="user-form">
							<div className="form-info">
								<h3>Welcome to Echo</h3>
							</div>
							<div className="field-wrap">
								<Form.Field>
									<label htmlFor="AccountName">Account name</label>
									<input id="AccountName" placeholder="Account name" />
								</Form.Field>
								<Form.Field>
									<label htmlFor="PasOrWifiKey">Password or WIF-key</label>
									<input placeholder="Password or WIF-key" />
								</Form.Field>
							</div>
							<Button basic type="submit" color="orange" onClick={(e) => this.onSubmit(e)}>Log In</Button>
							{/* <Button type="submit" color="orange" className="load">Loading...</Button> */}
							<span className="sign-nav">
								Don’t have an account?
								<Link className="link orange" to="/sign-up"> Sign Up</Link>
							</span>
							<Button basic type="button" color="red" onClick={() => this.lockAccount()}>Lock</Button>
						</Form>
					</div>
				</div>
				<Footer />
			</Segment>
		);
	}

}

SignIn.propTypes = {
	openUnlockModal: PropTypes.func.isRequired,

};

export default connect(() => ({}), (dispatch) => ({
	openUnlockModal: () => dispatch(openUnlockModal()),
}))(SignIn);
