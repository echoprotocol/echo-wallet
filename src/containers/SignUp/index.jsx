import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';


import Footer from '../../components/Footer/index';
import FormComponent from './FormComponent';
import CheckComponent from './CheckComponent';

import { SIGN_IN_PATH } from '../../constants/RouterConstants';
import { FORM_SIGN_UP } from '../../constants/FormConstants';

class SignUp extends React.Component {

	render() {
		const { accepted } = this.props;

		return (
			<Segment basic className="wrapper">
				<div className="content center-mode">
					<div>
						<Form className="user-form">
							<div className="form-info">
								<h3>Welcome to Echo</h3>
							</div>
							<FormComponent />
							<CheckComponent />

							<Button basic type="submit" className={accepted ? '' : 'disabled'} color="orange">Create account</Button>
							{/* FOR BUTTON WHIT LOADING:
								<Button type="submit" color="orange"  className="load">Loading...</Button>
							*/}
							<span className="sign-nav">
								Have an account?
								<Link className="link orange" to={SIGN_IN_PATH}> Login</Link>
							</span>
						</Form>
					</div>
				</div>
				<Footer />
			</Segment>
		);
	}

}

SignUp.propTypes = {
	accepted: PropTypes.bool,
};

SignUp.defaultProps = {
	accepted: false,
};


export default connect((state) => ({
	accepted: state.form.getIn([FORM_SIGN_UP, 'accepted']),

}))(SignUp);
