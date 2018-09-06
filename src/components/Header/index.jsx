import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dropdown, Button } from 'semantic-ui-react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { logout, addAccount, formatAccountsBalances, initAccount } from '../../actions/GlobalActions';

import { HEADER_TITLE } from '../../constants/GlobalConstants';
import {
	ACTIVITY_PATH,
	TRANSFER_PATH,
	INDEX_PATH,
	CONTRACT_LIST_PATH,
	PERMISSIONS_PATH,
} from '../../constants/RouterConstants';

import { formatAmount } from '../../helpers/FormatHelper';

class Header extends React.Component {

	componentWillReceiveProps(nextProps) {
		if (_.isEqual(this.props, nextProps)) {
			return;
		}

		this.props.formatAccounts();
	}

	onLogout() {
		this.props.logout();
	}

	onAddAccount() {
		this.props.addAccount();
	}

	onSend(e) {
		e.preventDefault();

		this.props.history.push(TRANSFER_PATH);
	}

	onchangeAccount(e, name) {
		const { accountName } = this.props;

		if (accountName === name) {
			return;
		}

		this.props.initAccount(name);
	}

	onDropdownChange(e, value) {
		if (e.keyCode === 13) {
			switch (value) {
				case 'current_account':
					break;

				case 'add-account':
					break;

				case 'logout':
					break;

				default:
			}
		}

	}

	onReturnToBack(e) {
		e.preventDefault();
		e.target.blur();
		this.props.history.goBack();


	}

	getTitle() {
		const { location } = this.props;

		const item = HEADER_TITLE.find((title) => {
			if (title.path === location.pathname) {
				return true;
			} else if (title.path.split('/')[1] === location.pathname.split('/')[1]) {
				return true;
			}
			return false;
		});
		return item ? item.title : '';
	}

	renderAccounts() {
		const { core, accounts } = this.props;
		return (
			accounts.toJS().map((account, index) => {
				const id = index;
				const balance = formatAmount(account.balance, core.toJS().precision);

				return (
					{
						value: `account${id}`,
						key: `account${id}`,
						content: (
							<button className="user-item" key={id} onClick={(e) => this.onchangeAccount(e, account.name)}>
								<span>{account.name}</span>
								<div className="balance">
									<span>{balance || '0'}</span>
									<span>{core.toJS().symbol || 'ECHO'}</span>
								</div>
							</button>
						),
					}
				);
			})
		);
	}

	render() {

		const {
			location, accounts, core, accountName,
		} = this.props;

		const asset = this.props.assets.find((check) => check.symbol === 'ECHO');
		const balance = asset ? formatAmount(asset.balance, asset.precision) : '0';
		const symbol = asset ? asset.symbol : 'ECHO';
		const renderedAccounts = (accounts && core) && this.renderAccounts();
		const isSub = [
			INDEX_PATH, CONTRACT_LIST_PATH, ACTIVITY_PATH, PERMISSIONS_PATH,
		].includes(`/${location.pathname.split('/')[1]}`);

		let options = [
			{
				value: 'add-account',
				key: 'add-account',
				className: 'add-account',
				content: 'Add account',
				onClick: (e) => this.onAddAccount(e),
			},
			{
				value: 'logout',
				key: 'logout',
				className: 'logout-wrap',
				content: (
					<a className="user-panel">
						<span className="logout">Logout</span>
					</a>
				),
				onClick: (e) => this.onLogout(e),
			},
		];

		options = renderedAccounts.concat(options);

		return (
			<div className="header">
				<button
					className={classnames('icon-back', { sub: !isSub })}
					onClick={(e) => this.onReturnToBack(e)}
				/>

				<div className="page-title">{this.getTitle()}</div>
				<div className="panel-right">
					<Button
						icon="send"
						className="send"
						content="Send"
						onClick={(e) => this.onSend(e)}
					/>
					<div className="user-section">
						<Link className="balance" to={INDEX_PATH}>
							<span>
								{balance}
							</span>
							<span>
								{symbol}
							</span>
						</Link>

						<Dropdown
							options={options}
							text={accountName}
							onChange={(e, { value }) => this.onDropdownChange(e, value)}
						/>

					</div>
				</div>
			</div>
		);
	}

}

Header.propTypes = {
	assets: PropTypes.any,
	core: PropTypes.any,
	accounts: PropTypes.any,
	accountName: PropTypes.string,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired,
	addAccount: PropTypes.func.isRequired,
	formatAccounts: PropTypes.func.isRequired,
	initAccount: PropTypes.func.isRequired,
};

Header.defaultProps = {
	assets: null,
	core: null,
	accounts: null,
	accountName: '',
};

export default withRouter(connect(
	(state) => ({
		assets: state.balance.get('assets'),
		core: state.balance.getIn(['core']),
		accounts: state.global.get('accounts'),
		accountName: state.global.getIn(['activeUser', 'name']),
		systemAccounts: state.echojs.getIn(['data', 'accounts']),
	}),
	(dispatch) => ({
		logout: () => dispatch(logout()),
		addAccount: () => dispatch(addAccount()),
		formatAccounts: () => dispatch(formatAccountsBalances()),
		initAccount: (value) => dispatch(initAccount(value)),
	}),
)(Header));
