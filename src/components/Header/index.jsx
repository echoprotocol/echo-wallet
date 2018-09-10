import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dropdown, Button } from 'semantic-ui-react';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';


import { logout, initAccount, historyMove } from '../../actions/GlobalActions';

import { HEADER_TITLE } from '../../constants/GlobalConstants';
import {
	SIGN_IN_PATH,
	SIGN_UP_PATH,
	ACTIVITY_PATH,
	TRANSFER_PATH,
	INDEX_PATH,
	CONTRACT_LIST_PATH,
	PERMISSIONS_PATH,
	VIEW_CONTRACT_PATH,
} from '../../constants/RouterConstants';

import { formatAmount } from '../../helpers/FormatHelper';

class Header extends React.Component {

	onLogout() {
		this.props.logout();
	}

	onSub(location) {
		return !!location.pathname.split('/')[2] || ![
			INDEX_PATH,
			CONTRACT_LIST_PATH,
			ACTIVITY_PATH,
			PERMISSIONS_PATH,
			VIEW_CONTRACT_PATH,
			TRANSFER_PATH,
		].includes(`/${location.pathname.split('/')[1]}`);
	}

	onAddAccount(e) {
		e.preventDefault();

		this.props.history.push(SIGN_IN_PATH, { isAddAccount: true });
	}


	onChangeAccount(e, name) {
		const { accountName, networkName } = this.props;

		if (accountName === name) {
			return;
		}

		this.props.initAccount(name, networkName);
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
		this.props.historyPop();
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

	isShowBackButton() {
		const { globalHistory } = this.props;
		const authPaths = [SIGN_IN_PATH, SIGN_UP_PATH];

		if (!globalHistory.get(-2)) {
			return false;
		} else if (authPaths.includes(globalHistory.get(-2))) {
			return false;
		}
		return true;
	}

	renderList() {
		const { preview, accountName } = this.props;

		return preview.map(({
			name, balance: { amount, precision, symbol },
		}) => {
			const content = (
				<button
					key={name}
					className="user-item"
					onClick={(e) => this.onChangeAccount(e, name)}
				>
					<span>{name}</span>
					<div className="balance">
						<span>{formatAmount(amount, precision) || '0'}</span>
						<span>{symbol || 'ECHO'}</span>
					</div>
				</button>
			);

			return ({
				value: name,
				key: name,
				content,
				selected: accountName === name,
			});
		});
	}

	render() {
		const {
			location, accountName, assets,
		} = this.props;

		const parsedLocation = `/${location.pathname.split('/')[1]}`;
		const asset = assets.find((i) => i.symbol === 'ECHO');
		const balance = asset ? formatAmount(asset.balance, asset.precision) : '0';
		const symbol = asset ? asset.symbol : 'ECHO';

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

		options = this.renderList().concat(options);

		return (
			<div className="header">
				{
					this.isShowBackButton() ?
						(
							<button
								className={classnames('icon-back', { sub: this.onSub(location) })}
								onClick={(e) => this.onReturnToBack(e)}
							/>
						) : null
				}


				<div className="page-title">{this.getTitle()}</div>
				<div className="panel-right">

					<NavLink
						exact
						className="nav-link"
						replace={TRANSFER_PATH === parsedLocation}
						to={TRANSFER_PATH}
					>
						<Button
							icon="send"
							className="send"
							content="Send"
						/>
					</NavLink>
					<div className="user-section">
						<NavLink
							exact
							className="nav-link balance"
							onClick={(e) => e.target.blur()}
							replace={INDEX_PATH === parsedLocation}
							to={INDEX_PATH}
						>
							<span>
								{balance}
							</span>
							<span>
								{symbol}
							</span>
						</NavLink>
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
	accountName: PropTypes.string.isRequired,
	networkName: PropTypes.string.isRequired,
	preview: PropTypes.array.isRequired,
	assets: PropTypes.array.isRequired,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired,
	initAccount: PropTypes.func.isRequired,
	showBackButton: PropTypes.bool.isRequired,
	historyPop: PropTypes.func.isRequired,
	globalHistory: PropTypes.object.isRequired,
};

export default withRouter(connect(
	(state) => ({
		accountName: state.global.getIn(['activeUser', 'name']),
		networkName: state.global.getIn(['network', 'name']),
		assets: state.balance.get('assets').toJS(),
		preview: state.balance.get('preview').toJS(),
		showBackButton: state.global.get('showBackButton'),
		globalHistory: state.global.get('history'),
	}),
	(dispatch) => ({
		logout: () => dispatch(logout()),
		initAccount: (name, network) => dispatch(initAccount(name, network)),
		historyPop: () => dispatch(historyMove()),
	}),
)(Header));
