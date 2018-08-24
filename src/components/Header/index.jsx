import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dropdown, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { logout } from '../../actions/GlobalActions';

import { HEADER_TITLE } from '../../constants/GlobalConstants';
import {
	BALANCES_PATH,
	TRANSFER_PATH,
	INDEX_PATH,
	ADD_CONTRACT_PATH,
	CREATE_CONTRACT_PATH,
	CONTRACT_LIST_PATH,
} from '../../constants/RouterConstants';

import { formatAmount } from '../../helpers/FormatHelper';

class Header extends React.Component {

	onLogout() {
		this.props.logout();
	}

	onSend(e) {
		e.preventDefault();

		this.props.history.push(TRANSFER_PATH);
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
		if ([ADD_CONTRACT_PATH, CREATE_CONTRACT_PATH].includes(`/${location.pathname.split('/')[1]}`)) {
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

	render() {
		const { location } = this.props;

		const asset = this.props.assets.find((check) => check.symbol === 'ECHO');

		const balance = asset ? formatAmount(asset.balance, asset.precision) : '0';
		const symbol = asset ? asset.symbol : 'ECHO';
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
						<Dropdown text={localStorage.getItem('current_account')}>
							<Dropdown.Menu>
								<Dropdown.Item>
									<a className="user-item">
										<span>{localStorage.getItem('current_account')}</span>
										<div className="balance">
											<span>{balance}</span>
											<span>{symbol}</span>
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
	assets: PropTypes.any,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired,
};

Header.defaultProps = {
	assets: null,
};

export default withRouter(connect(
	(state) => ({
		assets: state.balance.get('assets'),
	}),
	(dispatch) => ({
		logout: () => dispatch(logout()),
	}),
)(Header));
