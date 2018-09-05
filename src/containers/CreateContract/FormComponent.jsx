import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import classnames from 'classnames';

import { FORM_CREATE_CONTRACT } from '../../constants/FormConstants';
import { createContract } from '../../actions/TransactionActions';
import { setFormValue, setValue, clearForm } from '../../actions/FormActions';

class FormComponent extends React.Component {

	componentWillMount() {
		this.props.clearForm();
	}

	onChange(e) {
		const field = e.target.name;
		const { value } = e.target;
		if (field) {
			this.props.setFormValue(field, value);
		}
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
		this.props.setValue('addToWatchList', !this.props.addToWatchList);
	}

	isDisabledSubmit() {
		const { bytecode } = this.props;

		return (!bytecode.value || bytecode.error);
	}

	renderWatchListData() {
		const { name, abi } = this.props;
		return (
			<React.Fragment>
				<div className={classnames({ error: name.error, 'error-wrap': true })}>
					<div className="action-wrap">
						<Form.Field
							label="Name"
							placeholder="Name"
							control="input"
							name="name"
							value={name.value}
							onChange={(e) => this.onChange(e, true)}
						/>
					</div>
					<span className="error-message">{name.error}</span>
				</div>
				<div className={classnames({ error: abi.error, 'error-wrap': true })}>
					<div className="action-wrap">
						<Form.Field
							label="ABI"
							placeholder="ABI"
							control="textarea"
							name="abi"
							value={abi.value}
							onChange={(e) => this.onChange(e, true)}
						/>
					</div>
					<span className="error-message">{abi.error}</span>
				</div>
			</React.Fragment>
		);
	}

	render() {
		const { bytecode } = this.props;
		return (
			<div className="field-wrap">
				<div className="form-info">
					<h3>Create Smart Contract</h3>
				</div>
				<div className={classnames({ error: bytecode.error, 'error-wrap': true })}>
					<div className="action-wrap">
						<Form.Field
							label="Byte Code"
							placeholder="Byte Code"
							control="textarea"
							name="bytecode"
							value={bytecode.value}
							onChange={(e) => this.onChange(e)}
						/>

					</div>
					<span className="error-message">{bytecode.error}</span>
				</div>
				<div className={classnames({ active: this.props.addToWatchList, 'shrink-wrap': true })}>
					<div className="check">
						<input type="checkbox" id="addToWatchList" onChange={() => this.onToggle()} checked={this.props.addToWatchList} />
						<label className="label" htmlFor="addToWatchList">
							<span className="label-text">Add to watch list</span>
						</label>
					</div>
					<div className="shrink">
						{this.renderWatchListData()}
					</div>
					<Button
						basic
						type="submit"
						className={classnames('main-btn', { disabled: this.isDisabledSubmit() })}
						onClick={(e) => this.onClick(e)}
						content="Create"
					/>
				</div>

			</div>
		);
	}

}

FormComponent.propTypes = {
	bytecode: PropTypes.object.isRequired,
	name: PropTypes.object.isRequired,
	abi: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
	addToWatchList: PropTypes.bool.isRequired,
	createContract: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};
export default connect(
	(state) => ({
		bytecode: state.form.getIn([FORM_CREATE_CONTRACT, 'bytecode']),
		name: state.form.getIn([FORM_CREATE_CONTRACT, 'name']),
		abi: state.form.getIn([FORM_CREATE_CONTRACT, 'abi']),
		addToWatchList: state.form.getIn([FORM_CREATE_CONTRACT, 'addToWatchList']),
	}),
	(dispatch) => ({
		createContract: (value) => dispatch(createContract(value)),
		setValue: (field, value) => dispatch(setValue(FORM_CREATE_CONTRACT, field, value)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_CREATE_CONTRACT, field, value)),
		clearForm: () => dispatch(clearForm(FORM_CREATE_CONTRACT)),
	}),
)(FormComponent);
