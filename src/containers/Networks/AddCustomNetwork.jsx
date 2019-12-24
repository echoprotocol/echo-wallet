import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';

import ErrorMessage from '../../components/ErrorMessage';

class AddCustomNetwork extends React.Component {

	onChange(e) {
		const { name, value } = e.target;
		this.props.setFormValue(name, value);
	}

	renderField(name, { value, error }, isFocus) {
		const { intl } = this.props;
		const text = intl.formatMessage({ id: `add_connection_page.${name}_input.title` });
		return (
			<div className={classnames('field', { error })}>
				<label htmlFor="address">{name}</label>
				<input
					className="input"
					placeholder={text}
					name={text}
					value={value}
					onChange={(e) => this.onChange(e)}
					autoFocus={isFocus}
				/>
				<ErrorMessage
					value={error}
					intl={intl}
				/>
			</div>
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
	intl: PropTypes.any.isRequired,
};

export default injectIntl(AddCustomNetwork);
