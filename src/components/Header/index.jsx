import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dropdown, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { logout } from '../../actions/GlobalActions';
import { getAssetsBalances } from '../../actions/BalanceActions';

import { HEADER_TITLE } from '../../constants/GlobalConstants';
import { TRANSFER_PATH, BALANCES_PATH } from '../../constants/RouterConstants';

import formatAmount from '../../helpers/HistoryHelper';

class Header extends React.Component {

	componentDidUpdate(prevProps) {
		const account = this.props.account ? this.props.account.toJS() : null;
		const oldAccount = prevProps.account ? prevProps.account.toJS() : null;


		if (!account || !account.balances || !this.props.statistic) {
			return;
		}

		if (!oldAccount || !oldAccount.balances) {
			this.props.formatAssetsBalances(account.balances);
			return;
		}

		if (!this.props.statistic.equals(prevProps.statistic)) {
			this.props.formatAssetsBalances(account.balances);
		}
	}

	onLogout() {
		this.props.logout();
	}

	onSend(e) {
		e.preventDefault();

		this.props.history.push(TRANSFER_PATH);
	}

	getTitle() {
		const { location } = this.props;

		const item = HEADER_TITLE.find((title) => title.path === location.pathname);

		return item ? item.title : '';
	}

	render() {
		const asset = this.props.assets.find((check) => check.symbol === 'ECHO');

		const balance = asset ? formatAmount(asset.balance, asset.precision, asset.symbol) : '0 ECHO';

		return (
			<div className="header">
				<div className="page-title">{this.getTitle()}</div>
				<div className="panel-right">
					<Button color="blue" size="small" onClick={(e) => this.onSend(e)}>Send</Button>
					<div className="user-section">
						<Link className="balance" to={BALANCES_PATH}>
							<span>
								{balance}
							</span>
						</Link>
						<Dropdown text={localStorage.getItem('current_account')}>
							<Dropdown.Menu>
								<Dropdown.Item>
									<a className="user-item">
										<span>{localStorage.getItem('current_account')}</span>
										<div className="balance">
											<span>{balance}</span>
										</div>
									</a>
								</Dropdown.Item>
								{/* <Dropdown.Item>
									<a className="user-item">
										<span>user 2</span>
										<div className="balance">
											<span>1083.24299901</span>
											<span>ECHO</span>
										</div>
									</a>
								</Dropdown.Item> */}
								<Dropdown.Item>
									<a
										className="user-panel"
										role="button"
										onClick={(e) => this.onLogout(e)}
										onKeyPress={(e) => this.onLogout(e)}
										tabIndex="0"
									>
										{/* <span className="add-account">Add account</span> */}
										<span className="logout">Logout</span>
									</a>
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>
				</div>
			</div>
		);
	}

}

Header.propTypes = {
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	assets: PropTypes.any,
	statistic: PropTypes.any,
	account: PropTypes.any,
	logout: PropTypes.func.isRequired,
	formatAssetsBalances: PropTypes.func.isRequired,
};

Header.defaultProps = {
	assets: null,
	statistic: null,
	account: null,
};

export default withRouter(connect(
	(state) => {
		const assets = state.balance.get('assets');
		const accountId = state.global.getIn(['activeUser', 'id']);
		const account = state.echojs.getIn(['data', 'accounts', accountId]);
		let statistic = null;
		if (account) {
			const statisticId = account.getIn(['balances', '1.3.0']);
			statistic = state.echojs.getIn(['data', 'objects', statisticId]);
		}

		return { account, assets, statistic };
	},
	(dispatch) => ({
		logout: () => dispatch(logout()),
		formatAssetsBalances: (value) => dispatch(getAssetsBalances(value)),
	}),
)(Header));
