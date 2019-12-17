import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FocusLock from 'react-focus-lock';

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


	onConfirm(accounts) {
		this.props.importAccounts(accounts);
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

	renderSort(sortType, sortInc, type) {
		return (
			<div className="sort">
				<i className={classnames('icon-sort-up', { active: sortType === type && sortInc })} />
				<i className={classnames('icon-sort-down', { active: sortType === type && !sortInc })} />
			</div>
		);
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

		const { show, accounts } = this.props;
		const { checkedAll } = this.state;
		const { sortType, sortInc } = this.props.sort.toJS();

		return (
			<Modal className="choose-account" open={show}>
				<FocusLock autoFocus={false}>
					<div className="modal-content">
						<div className="modal-header" />
						<div className="modal-body">
							<Form className="main-form">
								<div className="form-info">
									<h3>Choose account</h3>
								</div>
								<section className="accounts-list">
									<div className="accounts-list-header">
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
												{ this.renderSort(sortType, sortInc, 'name') }
											</button>
										</div>
										<div className="check-container">
											<div className="txt">Balance</div>
											<button className="sort" onClick={() => this.onSort('balance')}>
												{ this.renderSort(sortType, sortInc, 'balance') }
											</button>
										</div>
									</div>
									<div className="accounts-list-list">
										{
											this.sortList().map((account) => this.renderAccounts(account))
										}
									</div>
								</section>
								<div className="form-panel">
									<Button
										className="main-btn"
										onClick={() => this.onClose()}
										content="Cancel"
									/>
									<Button
										className="main-btn"
										onClick={() => this.onConfirm(accounts)}
										content="Continue"
									/>
								</div>
							</Form>
						</div>
					</div>
				</FocusLock>
			</Modal>
		);
	}

}

ModalChooseAccount.propTypes = {
	show: PropTypes.bool,
	accounts: PropTypes.any,
	sort: PropTypes.object.isRequired,
	closeModal: PropTypes.func.isRequired,
	toggleChecked: PropTypes.func.isRequired,
	importAccounts: PropTypes.func.isRequired,
	toggleSort: PropTypes.func.isRequired,
};

ModalChooseAccount.defaultProps = {
	show: false,
	accounts: [],
};

export default ModalChooseAccount;
