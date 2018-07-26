import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { FORM_CREATE_CONTRACT } from '../../constants/FormConstants';

import { createContract } from '../../actions/ContractAction';

class ButtonComponent extends React.Component {

	onClick() {
		const { bytecode } = this.props;

		this.props.createContract({
			bytecode: bytecode.value.trim(),
		});
	}

	isDisabledSubmit() {
		const { bytecode, accepted } = this.props;

		return (!accountName.value || accountName.error) ||
			(!generatedPassword.value || generatedPassword.error) ||
			(!confirmPassword.value || confirmPassword.error) || !accepted;
	}

	renderLoading() {
		return (<Button type="submit" color="orange" className="load">Creating...</Button>);
	}

	renderSubmit() {
		return (
			<Button
				basic
				type="submit"
				color="orange"
				className={classnames({ disabled: this.isDisabledSubmit() })}
				onClick={(e) => this.onClick(e)}
			>
				Create account
			</Button>
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
	bytecode: PropTypes.object.isRequired,
	createContract: PropTypes.func.isRequired,
};

ButtonComponent.defaultProps = {
	accepted: false,
	loading: false,
};


export default connect(
	(state) => ({
		accepted: state.form.getIn([FORM_CREATE_CONTRACT, 'accepted']),
		loading: state.form.getIn([FORM_CREATE_CONTRACT, 'loading']),
		bytecode: state.form.getIn([FORM_CREATE_CONTRACT, 'bytecode']),
	}),
	(dispatch) => ({
		createContract: (value) => dispatch(createContract(value)),
	}),
)(ButtonComponent);
