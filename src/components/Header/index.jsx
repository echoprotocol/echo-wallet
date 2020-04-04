import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dropdown } from 'semantic-ui-react';
import { Map } from 'immutable';
import { FormattedMessage, injectIntl } from 'react-intl';

import { NavLink } from 'react-router-dom';
import { CACHE_MAPS } from 'echojs-lib';

import { initAccount, requestActiveAccountAndDelegate } from '../../actions/GlobalActions';
import { setValue } from '../../actions/TableActions';
import { MODAL_LOGOUT, MODAL_CHANGE_PARENT_ACCOUNT } from '../../constants/ModalConstants';
import { openModal } from '../../actions/ModalActions';

import { HEADER_TITLE } from '../../constants/GlobalConstants';

import Avatar from '../../components/Avatar';

import {
	SIGN_IN_PATH,
	ACTIVITY_PATH,
	INDEX_PATH,
	CONTRACT_LIST_PATH,
	PERMISSIONS_PATH,
	VIEW_CONTRACT_PATH,
	ADD_CONTRACT_PATH,
	SMART_CONTRACTS_PATH,
	CALL_CONTRACT_PATH,
	COMMITTEE_VOTE_PATH,
	FROZEN_FUNDS_PATH,
} from '../../constants/RouterConstants';

import { formatAmount } from '../../helpers/FormatHelper';
import { HISTORY_TABLE } from '../../constants/TableConstants';

const primaryPaths = [
	INDEX_PATH,
	CONTRACT_LIST_PATH,
	ACTIVITY_PATH,
	PERMISSIONS_PATH,
	VIEW_CONTRACT_PATH,
	COMMITTEE_VOTE_PATH,
];

const secondaryContractPaths = [
	ADD_CONTRACT_PATH,
	SMART_CONTRACTS_PATH,
	CALL_CONTRACT_PATH,
	VIEW_CONTRACT_PATH.replace('/:id', ''),
	FROZEN_FUNDS_PATH,
];

class Header extends React.Component {

	componentDidMount() {
		this.props.requestActiveAccountAndDelegate();
	}

	onAddAccount(e) {
		e.preventDefault();

		this.props.history.push(`${SIGN_IN_PATH}?isAddAccount=true`);
	}


	onChangeAccount(name) {
		const { accountName, networkName } = this.props;

		if (accountName === name) {
			return;
		}

		this.props.initAccount(name, networkName);
	}

	onRemoveAccount(name) {
		this.props.openModal(MODAL_LOGOUT, { accountName: name });
	}

	onChangeParentAccount(e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.openModal(MODAL_CHANGE_PARENT_ACCOUNT);
	}

	onDropdownChange(e, value) {

		if (e.type === 'click' || e.keyCode === 13) {
			switch (value) {
				case 'current_account':
					break;
				case 'add-account':
					this.onAddAccount(e);
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
		const { location, transactionData } = this.props;

		if (primaryPaths.includes(location.pathname)) return null;

		let to = ACTIVITY_PATH;
		let value = null;

		const path = `/${location.pathname.split('/')[1]}`;

		if (path === FROZEN_FUNDS_PATH) {
			to = INDEX_PATH;
		} else if (secondaryContractPaths.includes(path)) {
			to = CONTRACT_LIST_PATH;
		} else {
			value = transactionData ? transactionData.id : null;
		}

		return (
			<NavLink
				to={to}
				onClick={() => this.props.setValue('activeTransaction', value)}
				className="icon-back sub"
			/>
		);
	}

	renderUser(name, accountId, amount, precision, symbol) {
		return (
			<div key={name} className="user-item-wrap">
				<button
					className="user-item"
					onClick={() => this.onChangeAccount(name)}
				>
					<div className="avatar-wrap">
						<Avatar accountName={name} />
					</div>
					<div className="user-base-info">
						<div className="name">{name}</div>
						<div className="id">{accountId}</div>
					</div>
					<div className="balance">
						<span>{formatAmount(amount, precision) || '0'}</span>
						<span>{symbol || 'ECHO'}</span>
					</div>
				</button>
				<button
					tabIndex={-1}
					className="logout-user-btn"
					onClick={() => this.onRemoveAccount(name)}
				/>
			</div>
		);
	}

	renderUserWithParent(name, accountId, amount, precision, symbol) {
		const { delegate } = this.props;
		const delegateName = delegate.get('name') || '';
		return (
			<div key={name} className="parent-user-wrap">
				{this.renderUser(name, accountId, amount, precision, symbol)}
				<div className="divider" />
				<a
					href=""
					tabIndex="-1"
					onClick={(e) => this.onChangeParentAccount(e)}
				>
					<div className="user-item">
						<span className="parent-hint">
							Parent Account:
						</span>
						<div className="avatar-wrap">
							<Avatar accountName={delegateName} />
						</div>
						<div className="user-base-info">
							<div className="name-wrap">
								<div className="name">
									{delegateName.length > 8 ? delegateName.substring(0, 7).concat('...') : delegateName}
								</div>
							</div>
						</div>
						<div className="id">ID:&nbsp;{delegate.get('id')}</div>
						<p
							className="parent-link"
						>
							<FormattedMessage id="account_dropdown.change_delegate_button" />
						</p>
					</div>
				</a>
			</div>
		);
	}

	renderList() {
		const { preview, accountName } = this.props;
		return preview.map(({
			accountId,
			name, balance: { amount, precision, symbol },
		}) => {
			const content = (accountName === name ?
				this.renderUserWithParent(name, accountId, amount, precision, symbol) :
				this.renderUser(name, accountId, amount, precision, symbol)
			);

			return ({
				value: name,
				key: name,
				content,
				selected: accountName === name,
			});
		});
	}

	renderLinkToFrozenFunds() {
		const { totalFrozenFunds } = this.props;

		return (
			<div className="frozenfunds panel-right">
				<NavLink
					exact
					to="/frozen-funds"
					className="inner-tooltip-trigger"
				>
					<div className="inner-info">
						<div className="balance">
							<span>{totalFrozenFunds}</span>
							<span>ECHO</span>
						</div>
						<span>
							<FormattedMessage id="wallet_page.frozen_funds.title" />
						</span>
					</div>
					<span className="icon-frozen-funds" />
				</NavLink>
				<div className="inner-tooltip">
					<FormattedMessage id="wallet_page.frozen_funds.popup_header_text" />
				</div>
			</div>
		);
	}

	render() {
		const {
			location, accountName, assets, intl,
		} = this.props;

		const parsedLocation = `/${location.pathname.split('/')[1]}`;
		const asset = assets.find((i) => i.symbol === 'ECHO');
		const balance = asset ? formatAmount(asset.balance, asset.precision) : '0';
		const symbol = asset ? asset.symbol : 'ECHO';
		const addAcText = intl.formatMessage({ id: 'account_dropdown.add_account_button' });

		let options = [
			{
				value: 'add-account',
				key: 'add-account',
				className: 'add-account',
				content: addAcText,
				onClick: (e) => this.onAddAccount(e),
			},
		];

		options = this.renderList().concat(options);

		return (
			<header className="header">
				{
					this.renderLinkToParent()
				}

				<div className="page-title">
					{this.getTitle() && <FormattedMessage id={this.getTitle()} />}
				</div>
				{
					this.props.location.pathname === INDEX_PATH ?
						this.renderLinkToFrozenFunds() : null


				}
				<div className="panel-right">
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
							className="user-dropdown"
							options={options}
							text={accountName}
							selectOnBlur={false}
							onChange={(e, { value }) => this.onDropdownChange(e, value)}
						/>

					</div>
				</div>
			</header>
		);
	}

}

Header.propTypes = {
	accountName: PropTypes.string.isRequired,
	networkName: PropTypes.string.isRequired,
	preview: PropTypes.array.isRequired,
	assets: PropTypes.array.isRequired,
	totalFrozenFunds: PropTypes.string.isRequired,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	transactionData: PropTypes.object,
	initAccount: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	delegate: PropTypes.object.isRequired,
	intl: PropTypes.any.isRequired,
	requestActiveAccountAndDelegate: PropTypes.func.isRequired,
};

Header.defaultProps = {
	transactionData: null,
};

export default injectIntl(withRouter(connect(
	(state) => {
		const currentAccountId = state.global.getIn(['activeUser', 'id']);
		const currentAccount = state.echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, currentAccountId]);
		const delegateId = currentAccount ? currentAccount.getIn(['options', 'delegating_account']) : '';

		return {
			accountName: state.global.getIn(['activeUser', 'name']),
			networkName: state.global.getIn(['network', 'name']),
			assets: state.balance.get('assets').toJS(),
			preview: state.balance.get('preview').toJS(),
			totalFrozenFunds: state.balance.get('totalFrozenFunds'),
			showBackButton: state.global.get('showBackButton'),
			transactionData: state.transaction.get('details'),
			delegate: state.echojs.getIn([CACHE_MAPS.FULL_ACCOUNTS, delegateId]) || Map({}),
		};
	},
	(dispatch) => ({
		openModal: (type, accountName) => dispatch(openModal(type, accountName)),
		initAccount: (name, network) => dispatch(initAccount(name, network)),
		setValue: (field, value) => dispatch(setValue(HISTORY_TABLE, field, value)),
		requestActiveAccountAndDelegate: () => dispatch(requestActiveAccountAndDelegate()),
	}),
)(Header)));
