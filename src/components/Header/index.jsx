import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dropdown, Button } from 'semantic-ui-react';

import { NavLink } from 'react-router-dom';


import { initAccount, removeAccount } from '../../actions/GlobalActions';
import { setValue } from '../../actions/TableActions';
import { MODAL_LOGOUT } from '../../constants/ModalConstants';
import { openModal } from '../../actions/ModalActions';

import { HEADER_TITLE } from '../../constants/GlobalConstants';
import {
	SIGN_IN_PATH,
	ACTIVITY_PATH,
	TRANSFER_PATH,
	INDEX_PATH,
	CONTRACT_LIST_PATH,
	PERMISSIONS_PATH,
	VIEW_CONTRACT_PATH,
	ADD_CONTRACT_PATH,
	CREATE_CONTRACT_PATH,
	CALL_CONTRACT_PATH,
} from '../../constants/RouterConstants';

import { formatAmount } from '../../helpers/FormatHelper';
import { HISTORY_TABLE } from '../../constants/TableConstants';

const primaryPaths = [
	INDEX_PATH,
	CONTRACT_LIST_PATH,
	ACTIVITY_PATH,
	PERMISSIONS_PATH,
	VIEW_CONTRACT_PATH,
	TRANSFER_PATH,
];

const secondaryContractPaths = [
	ADD_CONTRACT_PATH,
	CREATE_CONTRACT_PATH,
	CALL_CONTRACT_PATH,
	VIEW_CONTRACT_PATH.replace('/:name', ''),
];

class Header extends React.Component {

	onOpenLogout() {
		this.props.openModal();
	}

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

	onRemoveAccount(e, name) {
		const { networkName } = this.props;

		this.props.removeAccount(name, networkName);
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

		if (secondaryContractPaths.includes(`/${location.pathname.split('/')[1]}`)) {
			to = CONTRACT_LIST_PATH;
		} else {
			value = transactionData.id;
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
			name, balance: { amount, precision, symbol },
		}) => {
			const content = (
				<div key={name} className="user-item-wrap">
					<button
						className="user-item"
						onClick={(e) => this.onChangeAccount(e, name)}
					>
						<span>{name}</span>
						<div className="balance">
							<span>{formatAmount(amount, precision) || '0'}</span>
							<span>{symbol || 'ECHO'}</span>
						</div>
					</button>
					{
						preview.length < 2 ? null : (
							<button
								className="logout-user-btn"
								onClick={(e) => this.onRemoveAccount(e, name)}
							/>
						)
					}
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
				onClick: (e) => this.onOpenLogout(e),
			},
		];

		options = this.renderList().concat(options);

		return (
			<div className="header">
				{
					this.renderLinkToParent()
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
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	transactionData: PropTypes.object,
	initAccount: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	removeAccount: PropTypes.func.isRequired,
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
		showBackButton: state.global.get('showBackButton'),
		transactionData: state.transaction.get('details'),
	}),
	(dispatch) => ({
		openModal: () => dispatch(openModal(MODAL_LOGOUT)),
		initAccount: (name, network) => dispatch(initAccount(name, network)),
		setValue: (field, value) => dispatch(setValue(HISTORY_TABLE, field, value)),
		removeAccount: (name, network) => dispatch(removeAccount(name, network)),
	}),
)(Header));
