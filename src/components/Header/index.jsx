import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dropdown } from 'semantic-ui-react';

import { NavLink } from 'react-router-dom';

import { initAccount } from '../../actions/GlobalActions';
import { setValue } from '../../actions/TableActions';
import { MODAL_LOGOUT } from '../../constants/ModalConstants';
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
	CREATE_CONTRACT_PATH,
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
	CREATE_CONTRACT_PATH,
	CALL_CONTRACT_PATH,
	VIEW_CONTRACT_PATH.replace('/:name', ''),
	FROZEN_FUNDS_PATH,
];

class Header extends React.Component {

	onAddAccount(e) {
		e.preventDefault();

		this.props.history.push(`${SIGN_IN_PATH}?isAddAccount=true`);
	}


	onChangeAccount(e, name) {
		const { accountName, networkName } = this.props;

		if (accountName === name) {
			return;
		}

		this.props.initAccount(name, networkName);
	}

	onRemoveAccount(name) {
		this.props.openModal({ accountName: name });
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

	renderList() {
		const { preview, accountName } = this.props;

		return preview.map(({
			accountId,
			name, balance: { amount, precision, symbol },
		}) => {
			const content = (
				<div key={name} className="user-item-wrap">
					<button
						className="user-item"
						onClick={(e) => this.onChangeAccount(e, name)}
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
						className="logout-user-btn"
						onClick={() => this.onRemoveAccount(name)}
					/>
				</div>
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
				>
					<div className="inner-info">
						<div className="balance">
							<span>{totalFrozenFunds}</span>
							<span>ECHO</span>
						</div>
						<span>Frozen funds</span>
					</div>
					<span className="icon-frozen-funds" />
				</NavLink>
				<div className="inner-tooltip">
					<p>
						Frozen funds allow you to get bigger reward for participating in blocks creation.
					</p>
				</div>
			</div>
		);
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
		];

		options = this.renderList().concat(options);

		return (
			<div className="header">
				{
					this.renderLinkToParent()
				}

				<div className="page-title">{this.getTitle()}</div>
				{
					this.props.location.pathname === INDEX_PATH ?
						this.renderLinkToFrozenFunds()
						:
						null


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
							options={options}
							text={accountName}
							selectOnBlur={false}
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
	totalFrozenFunds: PropTypes.string.isRequired,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	transactionData: PropTypes.object,
	initAccount: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
};

Header.defaultProps = {
	transactionData: null,
};

export default withRouter(connect(
	(state) => ({
		accountName: state.global.getIn(['activeUser', 'name']),
		networkName: state.global.getIn(['network', 'name']),
		assets: state.balance.get('assets').toJS(),
		preview: state.balance.get('preview').toJS(),
		totalFrozenFunds: state.balance.get('totalFrozenFunds'),
		showBackButton: state.global.get('showBackButton'),
		transactionData: state.transaction.get('details'),
	}),
	(dispatch) => ({
		openModal: (accountName) => dispatch(openModal(MODAL_LOGOUT, accountName)),
		initAccount: (name, network) => dispatch(initAccount(name, network)),
		setValue: (field, value) => dispatch(setValue(HISTORY_TABLE, field, value)),
	}),
)(Header));
