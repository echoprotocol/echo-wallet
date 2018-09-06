import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { FORM_SIGN_UP } from '../../constants/FormConstants';

import { createAccount } from '../../actions/AuthActions';

class ButtonComponent extends React.Component {

	onCreate() {
		const {
			accountName, generatedPassword, confirmPassword, isAddAccount,
		} = this.props;

		this.props.createAccount({
			accountName: accountName.value.trim(),
			generatedPassword: generatedPassword.value.trim(),
			confirmPassword: confirmPassword.value.trim(),
		}, isAddAccount);
	}

	isDisabledSubmit() {
		const {
			accepted,
			accountName,
			generatedPassword,
			confirmPassword,
		} = this.props;

		if ((!accountName.value || accountName.error) ||
			(!generatedPassword.value || generatedPassword.error) ||
			(!confirmPassword.value || confirmPassword.error) || !accepted) {
			return true;
		}

		return false;
	}

	renderLoading() {
		return (
			<Button
				type="submit"
				className="main-btn load"
				content="Creating..."
			/>
		);
	}

	renderSubmit() {
		const { isAddAccount } = this.props;

		return (
			<div className="btn-wrap">
				<Button
					basic
					type="submit"
					disabled={this.isDisabledSubmit()}
					className={classnames('main-btn', { disabled: this.isDisabledSubmit() })}
					onClick={(e) => this.onCreate(e)}
					content={isAddAccount ? 'Add Account' : 'Create Account'}
				/>
			</div>
		);
	}

	render() {
		const { loading } = this.props;

		return loading ? this.renderLoading() : this.renderSubmit();
	}

}

ButtonComponent.propTypes = {
	accepted: PropTypes.bool,
	loading: PropTypes.bool,
	isAddAccount: PropTypes.any,
	accountName: PropTypes.object.isRequired,
	generatedPassword: PropTypes.object.isRequired,
	confirmPassword: PropTypes.object.isRequired,
	createAccount: PropTypes.func.isRequired,
};

ButtonComponent.defaultProps = {
	accepted: false,
	loading: false,
	isAddAccount: false,
};


export default connect(
	(state) => ({
		accepted: state.form.getIn([FORM_SIGN_UP, 'accepted']),
		loading: state.form.getIn([FORM_SIGN_UP, 'loading']),
		accountName: state.form.getIn([FORM_SIGN_UP, 'accountName']),
		generatedPassword: state.form.getIn([FORM_SIGN_UP, 'generatedPassword']),
		confirmPassword: state.form.getIn([FORM_SIGN_UP, 'confirmPassword']),
	}),
	(dispatch) => ({
		createAccount: (value, isAdd) => dispatch(createAccount(value, isAdd)),
	}),
)(ButtonComponent);
