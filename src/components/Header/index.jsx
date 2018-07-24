import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dropdown, Button } from 'semantic-ui-react';

import { logout } from '../../actions/GlobalActions';

import { HEADER_TITLE } from '../../constants/GlobalConstants';

import { setAccountBalances } from '../../actions/AccountActions';

class Header extends React.Component {

	shouldComponentUpdate(nextProps) {
		const { account: currentAccount } = this.props;
		const { account: nextAccount } = nextProps;
		if ((currentAccount !== nextAccount) && currentAccount) {
			if ((this.props.account.toJS().balances['1.3.0'] !== nextProps.account.toJS().balances['1.3.0'])
				|| !this.props.balances) {
				this.props.setAccountBalances(Object.keys(this.props.account.toJS().balances)[0]);
			}
			return true; // перенести внутрь 2-го условия
		}
		return false;
	}

	onLogout() {
		this.props.logout();
	}

	getTitle() {
		const { location } = this.props;

		const item = HEADER_TITLE.find((title) => title.path === location.pathname);

		return item ? item.title : '';
	}

	render() {
		return (
			<div className="header">
				<div className="show-sidebar-btn" onClick={this.props.onToggleSidebar} onKeyPress={this.props.onToggleSidebar} role="button" tabIndex="0">
					<span className="icon-menu" />
				</div>
				<div className="page-title">{this.getTitle()}</div>
				<div className="panel-right">
					<Button color="blue" size="small">Send</Button>
					<div className="user-section">
						<div className="balance">
							<span>
								{this.props.balances && this.props.balances.length ? this.props.balances : 0}
							</span>
							<span>ECHO</span>
						</div>
						<Dropdown text={localStorage.getItem('current_account')}>
							<Dropdown.Menu>
								<Dropdown.Item>
									<a className="user-item">
										<span>user 1</span>
										<div className="balance">
											<span>0.000083</span>
											<span>ECHO</span>
										</div>
									</a>
								</Dropdown.Item>
								<Dropdown.Item>
									<a className="user-item">
										<span>user 2</span>
										<div className="balance">
											<span>1083.24299901</span>
											<span>ECHO</span>
										</div>
									</a>
								</Dropdown.Item>
								<Dropdown.Item>
									<a className="user-panel">
										<span className="add-account">Add account</span>
										<span className="logout" role="button" onClick={(e) => this.onLogout(e)} onKeyPress={(e) => this.onLogout(e)} tabIndex="0">Logout</span>
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
	balances: PropTypes.any,
	symbol: PropTypes.any,
	onToggleSidebar: PropTypes.func.isRequired,
	account: PropTypes.any,
	logout: PropTypes.func.isRequired,
	setAccountBalances: PropTypes.func.isRequired,
};

Header.defaultProps = {
	account: null,
	balances: null,
	symbol: null,
};

export default withRouter(connect(
	(state) => ({
		account: state.echojs.getIn(['userData', 'account']),
		balances: state.account.getIn(['account', 'balances']),
		symbol: state.account.getIn(['account', 'symbol']),
	}),
	(dispatch) => ({
		logout: () => dispatch(logout()),
		setAccountBalances: (value) => dispatch(setAccountBalances(value)),
	}),
)(Header));
