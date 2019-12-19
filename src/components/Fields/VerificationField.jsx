import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';


const VerificationField = (props) => {
	const {
		loading, value, error,
		status, disabled, name,
		label, placeholder,
		additionalLabel, autoFocus,
		icon, intl,
	} = props;

	return (
		<div className={classnames('field error-wrap', { error: !!error })}>
			{label &&
				<label htmlFor={name}>
					{label}
					{additionalLabel}
				</label>
			}

			<div className={classnames('action-wrap', { loading, icon: !!icon })}>
				{icon}
				<input
					type="text"
					placeholder={placeholder}
					name={name}
					value={value}
					autoComplete="off"
					onChange={(e) => props.onChange(e.target.value)}
					disabled={disabled}
					autoFocus={autoFocus}
				/>

				{ !disabled &&
				<span className={classnames('value-status', `icon-${status}`)} />
				}
			</div>

			{ !!error && intl.formatMessage &&
			<span className="error-message">{intl.formatMessage({ id: error })}</span> }
		</div>
	);
};


VerificationField.propTypes = {
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
	status: PropTypes.string,
	placeholder: PropTypes.string,
	loading: PropTypes.bool,
	error: PropTypes.string,
	disabled: PropTypes.bool,
	autoFocus: PropTypes.bool,
	additionalLabel: PropTypes.node,
	icon: PropTypes.node,
	intl: PropTypes.any,

};

VerificationField.defaultProps = {
	label: '',
	name: '',
	value: '',
	placeholder: '',
	error: '',
	loading: false,
	disabled: false,
	autoFocus: false,
	status: '',
	additionalLabel: null,
	icon: null,
	intl: {},
};

export default VerificationField;
