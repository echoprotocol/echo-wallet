import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
import classnames from 'classnames';
import Avatar from '../../components/Avatar';

import { PREFIX_ASSET } from '../../constants/GlobalConstants';
import { CONTRACT_ID_SUBJECT_TYPE } from '../../constants/TransferConstants';

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
				if (this.props.subject === 'to') {
					const validValue =
						await this.props.subjectToSendSwitch(this.props.field.value);
					if (!validValue) return;

					if (validValue === CONTRACT_ID_SUBJECT_TYPE) {
						this.props.setVisibility('bytecode', true);
					} else {
						this.props.setVisibility('bytecode', false);
					}

					this.props.setTransferFee();
				} else {
					const isValidValue =
						await this.props.checkAccount(this.props.field.value, this.props.subject);
					if (!isValidValue) return;
					const { currency } = this.props;
					if (currency && currency.id.startsWith(PREFIX_ASSET)) {
						this.props.getTransferFee()
							.then((fee) => fee && this.props.setValue('fee', fee));
					} else {
						this.props.setContractFees();
					}
				}
			}, 300),
		});
	}

	isAvatar() {
		const { field, subject, avatarName } = this.props;

		if (subject === 'to') {
			if (field.checked && !field.error && avatarName) {
				return true;
			}
		} else if (field.checked && !field.error) {
			return true;
		}

		return false;
	}

	render() {
		const {
			field, autoFocus, subject,	disabled, avatarName,
		} = this.props;

		return (
			<Form.Field className={classnames('error-wrap', { error: field.error })}>

				<label htmlFor={`account${subject}`}>{subject}</label>
				<Input
					type="text"
					placeholder={subject === 'to' ? 'Account ID, Account Name, Contract ID or Address' : 'Account Name'}
					icon={this.isAvatar()}
					className={classnames('action-wrap', { loading: field.loading && !field.error })}
					autoFocus={autoFocus}
					disabled={disabled}
				>
					{
						this.isAvatar() &&
						<div className="avatar-wrap">
							<Avatar accountName={avatarName || field.value} />
						</div>
					}
					<input name={`account${subject}`} value={field.value} onInput={(e) => this.onInput(e)} />
					{ field.checked && !field.error && !disabled &&
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
	autoFocus: PropTypes.bool,
	currency: PropTypes.object,
	subject: PropTypes.any.isRequired,
	field: PropTypes.any.isRequired,
	avatarName: PropTypes.string,
	checkAccount: PropTypes.func,
	subjectToSendSwitch: PropTypes.func,
	setTransferFee: PropTypes.func,
	setIn: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
	setVisibility: PropTypes.func,
	disabled: PropTypes.bool,
};

AccountField.defaultProps = {
	autoFocus: false,
	currency: null,
	disabled: false,
	checkAccount: null,
	subjectToSendSwitch: null,
	setTransferFee: null,
	setVisibility: null,
	avatarName: '',
};

export default AccountField;
