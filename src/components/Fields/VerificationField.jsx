import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';


function VerificationField(props) {
	const {
		loading, value,
		error, status,
		disabled, name,
		label,
	} = props;

	return (

		<Form.Field className={classnames('error-wrap', { error })}>
			{label && <label htmlFor={name}>{label}</label>}
			<div className={classnames('action-wrap', { loading: false })}>
				<input
					type="text"
					placeholder="Enter IP or URL"
					name={name}
					value={value}
					autoComplete="off"
					onChange={(e) => props.onChange(e.target.value)}
					disabled={disabled}
				/>
				{ !loading && true &&
					<span className={classnames('value-status', `icon-${status}`)} />
				}
			</div>

			{ error && <span className="error-message">{error}</span> }
		</Form.Field>
	);
}


VerificationField.propTypes = {
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
	status: PropTypes.string, // error or checked
	loading: PropTypes.bool,
	error: PropTypes.bool,
	disabled: PropTypes.bool,
};

VerificationField.defaultProps = {
	label: '',
	name: '',
	value: '',
	error: false,
	loading: false,
	status: null,
	disabled: false,
};

export default VerificationField;
