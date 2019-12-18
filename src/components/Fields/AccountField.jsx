import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../../components/Avatar';

import { PREFIX_ASSET } from '../../constants/GlobalConstants';
import { CONTRACT_ID_SUBJECT_TYPE } from '../../constants/TransferConstants';
import VerificationField from './VerificationField';

class AccountField extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			timeout: null,
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.activeCoinTypeTab !== this.props.activeCoinTypeTab && this.props.field.value) {
			this.checkInput(this.props.field.value);
		}
	}

	onInput(value) {
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}

		const trimedValue = value.trim();

		this.checkInput(trimedValue);
	}

	getStatus(field) {

		if (field.error) {
			return 'error';
		}

		if (field.checked) {
			return 'checked';
		}

		return null;
	}

	checkInput(value) {
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

					if (!validValue) {
						this.props.setVisibility('bytecode', false);
						return;
					}

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
			field, autoFocus, subject,	disabled, avatarName, placeholder,
			showAdditionalAccountInfo, additionalAccountInfo,
		} = this.props;

		const additionalLabel = showAdditionalAccountInfo && !field.error &&
			<div className="account-name">
				{additionalAccountInfo}
			</div>;

		const icon = this.isAvatar() &&
			<div className="avatar-wrap">
				<Avatar accountName={avatarName || field.value} />
			</div>;

		return (
			<VerificationField
				label={subject}
				additionalLabel={additionalLabel}
				name={`account${subject}`}
				onChange={(value) => this.onInput(value)}
				value={field.value}
				autoFocus={autoFocus}
				icon={icon}
				disabled={disabled}
				status={this.getStatus(field)}
				error={field.error}
				loading={field.loading && !field.error}
				placeholder={subject === 'to' ? placeholder : 'Account Name'}
			/>
		);
	}

}

AccountField.propTypes = {
	autoFocus: PropTypes.bool,
	currency: PropTypes.object,
	subject: PropTypes.any.isRequired,
	field: PropTypes.any.isRequired,
	avatarName: PropTypes.string,
	placeholder: PropTypes.string,
	activeCoinTypeTab: PropTypes.any,
	additionalAccountInfo: PropTypes.string,
	checkAccount: PropTypes.func,
	subjectToSendSwitch: PropTypes.func,
	setTransferFee: PropTypes.func,
	setIn: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setContractFees: PropTypes.func.isRequired,
	getTransferFee: PropTypes.func.isRequired,
	setVisibility: PropTypes.func,
	disabled: PropTypes.bool,
	showAdditionalAccountInfo: PropTypes.bool,
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
	activeCoinTypeTab: '',
	showAdditionalAccountInfo: false,
	additionalAccountInfo: '',
	placeholder: '',
};

export default AccountField;
