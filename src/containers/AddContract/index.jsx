import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { FORM_ADD_CONTRACT } from '../../constants/FormConstants';

import { setFormValue, clearForm } from '../../actions/FormActions';
import { addContract } from '../../actions/ContractActions';


class AddContractComponent extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
	}

	onInput(e) {
		this.props.setFormValue(e.target.name, e.target.value);
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
							className="ui input"
							value={name.value}
							onInput={(e) => this.onInput(e)}
						/>
						<span className="error-message">{name.error}</span>
					</Form.Field>
					<Form.Field className={classnames('error-wrap', { error: id.error })}>
						<label htmlFor="id">ID</label>
						<input
							type="text"
							placeholder="Contract ID"
							name="id"
							className="ui input"
							value={id.value}
							onInput={(e) => this.onInput(e)}
						/>
						<span className="error-message">{id.error}</span>
					</Form.Field>
					<Form.Field className={classnames('error-wrap', { error: abi.error })}>
						<label htmlFor="abi">ABI</label>
						<textarea
							type="text"
							placeholder="Contract ABI"
							name="abi"
							className="ui input"
							value={abi.value}
							onInput={(e) => this.onInput(e)}
						/>
						<span className="error-message">{abi.error}</span>
					</Form.Field>
				</div>
				<Button basic type="button" color="orange" onClick={(e) => this.onClick(e)}>Watch Contract</Button>
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
	}),
	(dispatch) => ({
		clearForm: () => dispatch(clearForm(FORM_ADD_CONTRACT)),
		setFormValue: (param, value) => dispatch(setFormValue(FORM_ADD_CONTRACT, param, value)),
		addContract: (name, id, abi) => dispatch(addContract(name, id, abi)),
	}),
)(AddContractComponent);
