import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import qs from 'query-string';

import FormComponent from './FormComponent';
import CheckComponent from './CheckComponent';
import ButtonComponent from './ButtonComponent';

import { SIGN_IN_PATH } from '../../constants/RouterConstants';

import { generatePassword } from '../../actions/AuthActions';

import { FORM_SIGN_UP } from '../../constants/FormConstants';

class SignUp extends React.Component {

	componentDidMount() {
		this.props.generatePassword();
	}

	onCancel() {
		this.props.history.goBack();
	}

	render() {
		const { location, loading } = this.props;

		const { isAddAccount } = qs.parse(location.search);

		return (
			<div className="sign-scroll-fix">
				<Form className="main-form">
					{
						isAddAccount ?
							<div className="form-info">
								<button className="back-link" onClick={(e) => this.onCancel(e)} disabled={loading}>
									<span className="icon-back" />
									back
								</button>
								<h3>Add Account</h3>
							</div> :
							<div className="form-info">
								<h3>Welcome to Echo</h3>
							</div>
					}
					<FormComponent />
					<CheckComponent />
					<ButtonComponent isAddAccount={isAddAccount} />
					<span className="sign-nav">
						Have an account?
						<Link
							className={classnames('link', 'orange', { disabled: loading })}
							to={`${SIGN_IN_PATH}${isAddAccount ? '?isAddAccount=true' : ''}`}
						>Login
						</Link>
					</span>
				</Form>
			</div>
		);
	}

}

SignUp.propTypes = {
	loading: PropTypes.bool,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	generatePassword: PropTypes.func.isRequired,
};

SignUp.defaultProps = {
	loading: false,
};

export default connect(
	(state) => ({
		loading: state.form.getIn([FORM_SIGN_UP, 'loading']),
	}),
	(dispatch) => ({
		generatePassword: () => dispatch(generatePassword()),
	}),
)(SignUp);
