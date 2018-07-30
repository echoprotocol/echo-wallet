import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { FORM_CREATE_CONTRACT } from '../../constants/FormConstants';

import { createContract } from '../../actions/TransactionActions';
import { clearForm } from '../../actions/FormActions';

class ButtonComponent extends React.Component {

	componentDidMount() {
		this.props.clearForm();
	}

	onClick() {
		const { bytecode } = this.props;

		this.props.createContract({
			bytecode: bytecode.value.trim(),
		});
	}

	isDisabledSubmit() {
		const { bytecode } = this.props;

		return (!bytecode.value || bytecode.error);
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
				Create contract
			</Button>
		);
	}

	render() {
		const { loading } = this.props;

		return loading ? this.renderLoading() : this.renderSubmit();
	}

}

ButtonComponent.propTypes = {
	loading: PropTypes.bool,
	bytecode: PropTypes.object.isRequired,
	createContract: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

ButtonComponent.defaultProps = {
	loading: false,
};


export default connect(
	(state) => ({
		loading: state.form.getIn([FORM_CREATE_CONTRACT, 'loading']),
		bytecode: state.form.getIn([FORM_CREATE_CONTRACT, 'bytecode']),
	}),
	(dispatch) => ({
		createContract: (value) => dispatch(createContract(value)),
		clearForm: () => dispatch(clearForm(FORM_CREATE_CONTRACT)),
	}),
)(ButtonComponent);
