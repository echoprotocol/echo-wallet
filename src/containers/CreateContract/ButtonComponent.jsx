import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { FORM_CREATE_CONTRACT } from '../../constants/FormConstants';

import { createContract, validateContractForm } from '../../actions/TransactionActions';
import { clearForm, setValue } from '../../actions/FormActions';

class ButtonComponent extends React.Component {

	constructor() {
		super();
		this.state = { checked: false };
	}

	componentDidMount() {
		this.props.clearForm();
	}

	onClick() {
		const { bytecode, name, abi } = this.props;

		this.props.createContract({
			bytecode: bytecode.value.trim(),
			name: name.value.trim(),
			abi: abi.value.trim(),
		});
	}

	onToggle() {
		this.setState({
			checked: !this.state.checked,
		});
		this.props.setValue('addToWatchList', !this.state.checked);
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
			<div className="form-panel">
				<div className="check orange">
					<input type="checkbox" id="addToWatchList" checked={this.state.checked} />
					<label className="label" onClick={() => this.onToggle()} htmlFor="addToWatchList">
						<span className="label-text">Add to watch list</span>
					</label>
				</div>
				<Button
					basic
					type="submit"
					color="orange"
					className={classnames({ disabled: this.isDisabledSubmit() })}
					onClick={(e) => this.onClick(e)}
					content="Create contract"
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
	loading: PropTypes.bool,
	bytecode: PropTypes.object.isRequired,
	name: PropTypes.object.isRequired,
	abi: PropTypes.object.isRequired,
	createContract: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	validateContractForm: PropTypes.func.isRequired,
};

ButtonComponent.defaultProps = {
	loading: false,
};


export default connect(
	(state) => ({
		loading: state.form.getIn([FORM_CREATE_CONTRACT, 'loading']),
		bytecode: state.form.getIn([FORM_CREATE_CONTRACT, 'bytecode']),
		name: state.form.getIn([FORM_CREATE_CONTRACT, 'name']),
		abi: state.form.getIn([FORM_CREATE_CONTRACT, 'abi']),
	}),
	(dispatch) => ({
		createContract: (value) => dispatch(createContract(value)),
		clearForm: () => dispatch(clearForm(FORM_CREATE_CONTRACT)),
		setValue: (field, value) => dispatch(setValue(FORM_CREATE_CONTRACT, field, value)),
		validateContractForm: (name, abi) => dispatch(validateContractForm(name, abi)),
	}),
)(ButtonComponent);
