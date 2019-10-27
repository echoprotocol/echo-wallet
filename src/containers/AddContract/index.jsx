import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { FORM_ADD_CONTRACT } from '../../constants/FormConstants';

import { setFormValue, clearForm } from '../../actions/FormActions';
import { addContract } from '../../actions/ContractActions';
import { version } from '../../../package.json';
import { contractIdRegex } from '../../helpers/ValidateHelper';


class AddContractComponent extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
	}

	onInput(e) {
		if (e.target.name === 'id' && e.target.value.match(contractIdRegex)) {
			this.props.setFormValue(e.target.name, e.target.value);
		} else if (e.target.name === 'name' || e.target.name === 'abi') {
			this.props.setFormValue(e.target.name, e.target.value);
		}
	}

	onClick() {
		const { name, id, abi } = this.props;

		if (name.error || id.error || abi.error) {
			return;
		}

		this.props.addContract(name.value.trim(), id.value.trim(), abi.value.trim());
	}

	render() {
		const { name, id, abi } = this.props;

		return (
			<Form className="main-form">
				<div className="form-info">
					<h3>Add contract to watch list</h3>
				</div>
				<div className="field-wrap">
					<Form.Field className={classnames('error-wrap', { error: name.error })}>
						<label htmlFor="name">Name</label>
						<input
							type="text"
							placeholder="Name"
							name="name"
							value={name.value}
							onChange={(e) => this.onInput(e)}
							autoFocus
						/>
						{
							name.error &&
								<span className="error-message">{name.error}</span>
						}
					</Form.Field>
					<Form.Field className={classnames('error-wrap', { error: id.error })}>
						<label htmlFor="id">ID</label>
						<input
							type="text"
							placeholder="Contract ID"
							name="id"
							value={id.value}
							onChange={(e) => this.onInput(e)}
						/>
						{
							id.error &&
								<span className="error-message">{id.error}</span>
						}

					</Form.Field>
					<Form.Field className={classnames('error-wrap', { error: abi.error })}>
						<label htmlFor="abi">ABI</label>
						<textarea
							type="text"
							placeholder="Contract ABI"
							name="abi"
							value={abi.value}
							onChange={(e) => this.onInput(e)}
						/>
						{
							abi.error &&
								<span className="error-message">{abi.error}</span>
						}
					</Form.Field>
					<div className="form-panel">
						<Button
							basic
							type="button"
							className="main-btn"
							content="Watch Contract"
							onClick={(e) => this.onClick(e)}
						/>
					</div>
				</div>


			</Form>
		);
	}

}

AddContractComponent.propTypes = {
	name: PropTypes.object.isRequired,
	id: PropTypes.object.isRequired,
	abi: PropTypes.object.isRequired,
	clearForm: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	addContract: PropTypes.func.isRequired,
};


export default connect(
	(state) => ({
		name: state.form.getIn([FORM_ADD_CONTRACT, 'name']),
		id: state.form.getIn([FORM_ADD_CONTRACT, 'id']),
		abi: state.form.getIn([FORM_ADD_CONTRACT, 'abi']),
		version,
	}),
	(dispatch) => ({
		clearForm: () => dispatch(clearForm(FORM_ADD_CONTRACT)),
		setFormValue: (param, value) => dispatch(setFormValue(FORM_ADD_CONTRACT, param, value)),
		addContract: (name, id, abi) => dispatch(addContract(name, id, abi)),
	}),
)(AddContractComponent);
