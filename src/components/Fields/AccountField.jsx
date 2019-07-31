import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
import classnames from 'classnames';

class AccountField extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			timeout: null,
		};
	}

	onInput(e) {
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}

		const value = e.target.value.toLowerCase().trim();

		this.props.setIn(this.props.subject, {
			loading: true,
			error: null,
			checked: false,
			value,
		});

		this.setState({
			timeout: setTimeout(async () => {
				const isValidAccount =
					await this.props.checkAccount(this.props.field.value, this.props.subject);
				if (!isValidAccount) return;
				this.props.setContractFees();
				this.props.getTransferFee()
					.then((fee) => fee && this.props.setFormValue('fee', fee));
			}, 300),
		});
	}

	render() {
		const { field, autoFocus, subject } = this.props;

		return (
			<Form.Field className={classnames('error-wrap', { error: field.error })}>

				<label htmlFor={`account${subject}`}>{subject}</label>
				<Input type="text" placeholder="Account name" className={classnames('action-wrap', { loading: field.loading && !field.error })} autoFocus={autoFocus}>
					<input name={`account${subject}`} value={field.value} onInput={(e) => this.onInput(e)} />
					{ field.checked && !field.error &&
						<span className={classnames('icon-checked value-status', { success: field.checked })} />
					}
					{ field.error ? <span className="icon-error-red value-status" /> : null }
				</Input>
				<span className="error-message">{field.error}</span>

			</Form.Field>
		);
	}

}

AccountField.propTypes = {
	subject: PropTypes.any.isRequired,
	autoFocus: PropTypes.bool,
	field: PropTypes.any.isRequired,
	checkAccount: PropTypes.func.isRequired,
	setIn: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
};

AccountField.defaultProps = {
	autoFocus: false,
};

export default AccountField;
