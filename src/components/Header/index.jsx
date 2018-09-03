import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dropdown, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { logout, addAccount } from '../../actions/GlobalActions';

import { HEADER_TITLE } from '../../constants/GlobalConstants';
import {
	BALANCES_PATH,
	TRANSFER_PATH,
	INDEX_PATH,
	ADD_CONTRACT_PATH,
	CREATE_CONTRACT_PATH,
	CONTRACT_LIST_PATH,
	CALL_CONTRACT_PATH,
} from '../../constants/RouterConstants';

import { formatAmount } from '../../helpers/FormatHelper';

class Header extends React.Component {

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

	renderLinkToParent() {
		const { location } = this.props;
		if ([
			ADD_CONTRACT_PATH,
			CREATE_CONTRACT_PATH,
			CALL_CONTRACT_PATH,
		].includes(`/${location.pathname.split('/')[1]}`)) {
			return (
				<Link to={CONTRACT_LIST_PATH} className="icon-back" />
			);
		}
		return (
			location.pathname.split('/').length > 2 ?
				<Link to={`/${location.pathname.split('/')[1]}`} className="icon-back" /> :
				<Link to={INDEX_PATH} className="icon-back" />
		);
	}

	renderAccounts() {
		const { core, accounts } = this.props;
		return (
			accounts.toJS().map((account, index) => {
				const id = index;
				const balance = formatAmount(account.balance, core.precision);

				return (
					{
						value: `account${id}`,
						key: `account${id}`,
						content: (
							<a className="user-item" key={id}>
								<span>{account.name}</span>
								<div className="balance">
									<span>{balance || '0'}</span>
									<span>{core ? core.symbol : 'ECHO'}</span>
								</div>
							</a>
						),
					}
				);
			})
		);
	}

	render() {
		const { location, accounts, core } = this.props;

		const asset = this.props.assets.find((check) => check.symbol === 'ECHO');

		const balance = asset ? formatAmount(asset.balance, asset.precision) : '0';
		const symbol = asset ? asset.symbol : 'ECHO';
		const accs = (accounts && core) && this.renderAccounts();

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

		options = accs.concat(options);

		return (
			<div className="header">
				{
					![INDEX_PATH, CONTRACT_LIST_PATH, BALANCES_PATH]
						.find((url) => url === location.pathname) &&
						this.renderLinkToParent()
				}
				<div className="page-title">{this.getTitle()}</div>
				<div className="panel-right">
					<Button
						icon="send"
						className="send"
						content="Send"
						onClick={(e) => this.onSend(e)}
					/>
					<div className="user-section">
						<Link className="balance" to={BALANCES_PATH}>
							<span>
								{balance}
							</span>
							<span>
								{symbol}
							</span>
						</Link>

						<Dropdown
							options={options}
							text={localStorage.getItem('current_account')}
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
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired,
	addAccount: PropTypes.func.isRequired,
};

Header.defaultProps = {
	assets: null,
	core: null,
	accounts: null,
};

export default withRouter(connect(
	(state) => ({
		assets: state.balance.get('assets'),
		core: state.balance.get('core'),
		accounts: state.balance.get('accountsBalances'),
	}),
	(dispatch) => ({
		logout: () => dispatch(logout()),
		addAccount: () => dispatch(addAccount()),
	}),
)(Header));
