import React from 'react';
import { Button, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import { updateContractName, disableContract } from '../../actions/ContractActions';
import { setFormValue, setValue, setFormError } from '../../actions/FormActions';

import { FORM_VIEW_CONTRACT } from '../../constants/FormConstants';
import { ECHO_ASSET_ID } from '../../constants/GlobalConstants';
import { validateContractName } from '../../helpers/ValidateHelper';
import ActionBtn from '../../components/ActionBtn';
import ErrorMessage from '../../components/ErrorMessage';

class ContractSettings extends React.Component {


	constructor() {
		super();
		this.state = {
			isEditName: false,
			timeout: null,
		};
		this.onFocusInput = this.onFocusInput.bind(this);
	}

	onBlurBlock(contractId) {
		this.setState({
			timeout: setTimeout(() => this.changeName(contractId), 100),
		});
	}

	onFocusBlock() {
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}
	}

	onFocusInput(component) {
		if (component) {
			component.focus();
		}
	}

	onChange(e) {
		const field = e.target.name;
		const { value } = e.target;
		if (field) {
			this.props.setFormValue(field, value);
		}
	}


	onOpen() {
		this.setState({ isEditName: true });
	}

	onClose(e) {
		e.preventDefault();
		this.setState({ isEditName: false });
		this.props.setValue('newName', { error: null, value: '' });
	}

	onPushEnter(e, contractId) {
		if (e.which === 13 || e.keyCode === 13) {
			this.changeName(contractId);
		}
	}

	changeName(id) {
		const newName = this.props.newName.value;

		if (newName) {
			const newNameError = validateContractName(newName.trim());

			if (newNameError) {
				this.props.setFormError('newName', newNameError);
				return;
			}

			this.props.updateContractName(id, newName.trim());
		}

		this.setState({ isEditName: false });

		this.props.setValue('newName', { error: null, value: '' });
	}

	removeContract(id) {
		this.props.disableContract(id);
	}

	showBalance(balance) {
		if (balance.length === 0) {
			return {};
		}

		if (balance.length === 1) {
			return balance[0];
		}

		const coreAsset = balance.find(({ amount, id: assetId }) => amount !== '0' && assetId === ECHO_ASSET_ID);

		if (coreAsset) {
			return coreAsset;
		}

		const anotherNotNullBalance = balance.find(({ amount, id: assetId }) => amount !== '0' && assetId !== ECHO_ASSET_ID);

		if (anotherNotNullBalance) {
			return anotherNotNullBalance;
		}

		return balance[0];
	}

	renderName() {
		const { contractName } = this.props;

		return (

			<Button
				className="value"
				onFocus={() => this.onOpen()}
			>
				<React.Fragment>
					{contractName}
					<span className="icon-edit" />
				</React.Fragment>
			</Button >

		);
	}

	renderChangeName() {
		const {
			newName, contractId, contractName, intl,
		} = this.props;

		return (

			<div
				className={classnames('error-wrap', { error: newName.error })}
				onBlur={() => this.onBlurBlock(contractId)}
				onFocus={() => this.onFocusBlock()}
			>
				<Input
					type="text"
					name="newName"
					defaultValue={contractName}
					ref={this.onFocusInput}
					className="label-in-left"
					onChange={(e) => this.onChange(e)}
					onKeyPress={(e) => this.onPushEnter(e, contractId)}
				>

					<input />
					<button
						className="edit-option icon-edit-checked"
						onClick={() => this.changeName(contractId)}
					/>
					<button
						className="edit-option icon-edit-close"
						onClick={(e) => this.onClose(e)}
					/>
				</Input>
<<<<<<< HEAD
				<ErrorMessage
					show={!!newName.error}
					value={newName.error}
				/>
=======

				{newName.error &&
				<span className="error-message">{intl.formatMessage({ id: newName.error })}</span>}
>>>>>>> 6dc49ee730c0c6d5b3138917d3d8597d3b3fa34f
			</div>
		);
	}

	render() {
		const { contractId, balances, intl } = this.props;

		const btnText = intl.formatMessage({ id: 'smart_contract_page.contract_info.header.remove_button_text' });
		const balanceToShow = this.showBalance(balances);

		return (
			<div className="tab-full">
				<div className="control-wrap">
					<ul className="control-panel">
						<li className="id-panel">
							<span className="label">
								<FormattedMessage id="smart_contract_page.contract_info.header.contract_id_text" />
							</span>
							<span className="value">
								{contractId}
							</span>
						</li>
						<li className="balance-panel">
							<span className="label">
								<FormattedMessage id="smart_contract_page.contract_info.header.balance_text" />
							</span>
							<span className="value">
								<div className="balance-wrap">
									<div className="balance">{balanceToShow.amount}</div>
									<div className="coin">{balanceToShow.symbol}</div>
								</div>
							</span>
						</li>
						<li className="name-panel">
							<span className="label">
								<FormattedMessage id="smart_contract_page.contract_info.header.name_text" />
							</span>
							{!this.state.isEditName ? this.renderName() : this.renderChangeName()}
						</li>
						<li className="action-panel">
							<ActionBtn
								action={() => this.removeContract(contractId)}
								icon="remove"
								text={btnText}
							/>
						</li>
					</ul>

				</div>
			</div>
		);
	}

}

ContractSettings.propTypes = {
	newName: PropTypes.object.isRequired,
	contractId: PropTypes.string.isRequired,
	contractName: PropTypes.string.isRequired,
	updateContractName: PropTypes.func.isRequired,
	disableContract: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	setFormError: PropTypes.func.isRequired,
	balances: PropTypes.array.isRequired,
	intl: PropTypes.any.isRequired,
};

export default injectIntl(withRouter(connect(
	(state) => ({
		newName: state.form.getIn([FORM_VIEW_CONTRACT, 'newName']),
		balances: state.contract.get('balances'),
		contractId: state.contract.get('id'),
		contractName: state.contract.get('name'),
	}),
	(dispatch) => ({
		updateContractName: (id, newName) => dispatch(updateContractName(id, newName)),
		disableContract: (name) => dispatch(disableContract(name)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_VIEW_CONTRACT, field, value)),
		setValue: (field, value) => dispatch(setValue(FORM_VIEW_CONTRACT, field, value)),
		setFormError: (field, value) => dispatch(setFormError(FORM_VIEW_CONTRACT, field, value)),
	}),
)(ContractSettings)));
