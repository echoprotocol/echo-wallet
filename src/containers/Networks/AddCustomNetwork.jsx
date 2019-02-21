import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';


class AddCustomNetwork extends React.Component {

	onChange(e) {
		const { name, value } = e.target;
		this.props.setFormValue(name, value);
	}

	renderField(name, { value, error }, isFocus) {
		return (
			<Form.Field className={classnames('error-wrap', { error })}>
				<label htmlFor="address">{name}</label>
				<input
					className="ui input"
					placeholder={name}
					name={name}
					value={value}
					onChange={(e) => this.onChange(e)}
					autoFocus={isFocus}
				/>
				<span className="error-message">{error}</span>
			</Form.Field>
		);
	}

	render() {
		const { address, name } = this.props;

		return (
			<React.Fragment>
				<div className="custom-network active">
					{this.renderField('address', address, true)}
					{this.renderField('name', name, false)}
				</div>
			</React.Fragment>
		);
	}

}

AddCustomNetwork.propTypes = {
	address: PropTypes.object.isRequired,
	name: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
};

export default AddCustomNetwork;
