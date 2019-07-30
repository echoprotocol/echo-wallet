import React from 'react';
import { Modal, Form, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { importSelectedAccounts } from '../../actions/AuthActions';
import { closeModal, update } from '../../actions/ModalActions';
import { toggleSort } from '../../actions/SortActions';

import { FORM_SIGN_IN } from '../../constants/FormConstants';
import { MODAL_CHOOSE_ACCOUNT } from '../../constants/ModalConstants';
import { SORT_ACCOUNTS } from '../../constants/GlobalConstants';

import { formatAmount } from '../../helpers/FormatHelper';

class ModalChooseAccount extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			checkedAll: false,
		};
	}


	onClose() {
		this.setState({ checkedAll: false });
		this.props.closeModal();
	}


	onConfirm(accounts, wif) {
		this.props.importAccounts(accounts, wif);
		this.onClose();
	}

	onSort(sortType) {
		this.props.toggleSort(sortType);
	}

	sortList() {
		const { accounts } = this.props;
		const { sortType, sortInc } = this.props.sort.toJS();

		if (sortType === 'balance') {
			return accounts.sort((a, b) => {
				if (a.balances[sortType] < b.balances[sortType]) {
					return 1 * (sortInc ? 1 : -1);
				}
				if (a.balances[sortType] > b.balances[sortType]) {
					return -1 * (sortInc ? 1 : -1);
				}
				return 0;
			});
		}

		return accounts.sort((a, b) => {
			if (a[sortType] > b[sortType]) {
				return -1 * (sortInc ? 1 : -1);
			}
			if (a[sortType] < b[sortType]) {
				return 1 * (sortInc ? 1 : -1);
			}
			return 0;
		});

	}

	toggleAllChecked(e, accounts) {
		this.setState({ checkedAll: !this.state.checkedAll });
		if (e.target.checked) {
			accounts = accounts.map((account) => {
				account.checked = true;
				return account;
			});
		} else {
			accounts = accounts.map((account) => {
				account.checked = false;
				return account;
			});
		}

		this.props.toggleChecked('accounts', accounts);

	}

	toggleChecked(accounts, id) {
		const index = accounts.findIndex((a) => a.id === id);
		if (this.state.checkedAll) {
			this.setState({ checkedAll: false });
		}
		accounts = accounts.update(index, (account) => ({ ...account, checked: !account.checked }));

		if (accounts.every((account) => account.checked)) {
			this.setState({ checkedAll: true });
		}

		this.props.toggleChecked('accounts', accounts);
	}
	renderAccounts(account) {
		const { accounts } = this.props;

		return (
			<div className="line" key={account.id}>
				<div className="check">
					<input
						type="checkbox"
						checked={account.checked}
						onChange={() => this.toggleChecked(accounts, account.id)}
						id={account.name}
					/>
					<label
						className="label"
						htmlFor={account.name}
					>
						<span className="label-text">{account.name}</span>
					</label>
				</div>
				<div className="value">
					{formatAmount(account.balances.balance, account.balances.precision, ' ')}
					{account.balances.symbol}
				</div>
			</div>
		);
	}

	render() {

		const { show, accounts, wif } = this.props;
		const { checkedAll } = this.state;
		const { sortType, sortInc } = this.props.sort.toJS();

		return (
			<Modal className="choose-account" open={show} dimmer="inverted">
				<div className="modal-content">
					<div className="modal-header" />
					<div className="modal-body">
						<Form className="main-form">
							<div className="form-info">
								<h3>Choose account</h3>
							</div>
							<section className="accounts-list">
								<div className="accounts-list_header">
									<div className="check-container">
										<div className="check">
											<input
												onChange={(e) => this.toggleAllChecked(e, accounts)}
												checked={checkedAll}
												type="checkbox"
												id="check-all"
											/>
											<label
												className="label"
												htmlFor="check-all"
											>
												<span className="label-text">Accounts</span>
											</label>
										</div>
										<button className="sort" onClick={() => this.onSort('name')}>
											<Icon
												name="dropdown"
												flipped="vertically"
												className={classnames({ active: sortType === 'name' && sortInc })}
											/>
											<Icon
												name="dropdown"
												flipped="horizontally"
												className={classnames({ active: sortType === 'name' && !sortInc })}
											/>
										</button>
									</div>
									<div className="check-container">
										<div className="txt">Balance</div>
										<button className="sort" onClick={() => this.onSort('balance')}>
											<Icon
												name="dropdown"
												flipped="vertically"
												className={classnames({ active: sortType === 'balance' && sortInc })}
											/>
											<Icon
												name="dropdown"
												flipped="horizontally"
												className={classnames({ active: sortType === 'balance' && !sortInc })}
											/>
										</button>
									</div>
								</div>
								<div className="accounts-list_list">
									{
										this.sortList().map((account) => this.renderAccounts(account))
									}
								</div>
							</section>
							<div className="form-panel">
								<Button
									basic
									type="button"
									className="main-btn"
									onClick={() => this.onClose()}
									content="Cancel"
								/>
								<Button
									basic
									type="button"
									className="main-btn"
									onClick={() => this.onConfirm(accounts, wif)}
									content="Continue"
								/>
							</div>
						</Form>
					</div>
				</div>
			</Modal>
		);
	}

}

ModalChooseAccount.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func.isRequired,
	toggleChecked: PropTypes.func.isRequired,
	importAccounts: PropTypes.func.isRequired,
	toggleSort: PropTypes.func.isRequired,
	accounts: PropTypes.any,
	wif: PropTypes.string,
	sort: PropTypes.object.isRequired,
};

ModalChooseAccount.defaultProps = {
	show: false,
	accounts: [],
	wif: '',
};

export default connect(
	(state) => ({
		show: state.modal.getIn([MODAL_CHOOSE_ACCOUNT, 'show']),
		accounts: state.modal.getIn([MODAL_CHOOSE_ACCOUNT, 'accounts']),
		wif: state.form.getIn([FORM_SIGN_IN, 'wif']).value,
		sort: state.sort.get(SORT_ACCOUNTS),
	}),
	(dispatch) => ({
		closeModal: () => dispatch(closeModal(MODAL_CHOOSE_ACCOUNT)),
		toggleChecked: (param, value) => dispatch(update(MODAL_CHOOSE_ACCOUNT, param, value)),
		importAccounts: (accounts, wif) => dispatch(importSelectedAccounts(accounts, wif)),
		toggleSort: (type) => dispatch(toggleSort(SORT_ACCOUNTS, type)),
	}),
)(ModalChooseAccount);
