import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dropdown, Button } from 'semantic-ui-react';
import { EchoJSActions } from 'echojs-redux';

import { logout } from '../../actions/GlobalActions';

import { HEADER_TITLE } from '../../constants/GlobalConstants';

import { formatAmount } from '../../helpers/HistoryHelper';

class Header extends React.Component {

	constructor() {
		super();
		this.currentBalance = null;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.balances) {
			this.props.fetch('1.3.0');
			this.props.fetch(nextProps.balances.get('1.3.0'));
			this.currentBalance = nextProps.balances.get('1.3.0');
		}
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
								{
									Object.keys(this.props.data.objects).length
									&& Object.keys(this.props.data.assets).length
									&& this.currentBalance ?
										formatAmount(
											this.props.data.objects[this.currentBalance].balance,
											this.props.data.assets['1.3.0'].precision,
											this.props.data.assets['1.3.0'].symbol,
										) : '0 ECHO'
								}
							</span>
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
	data: PropTypes.any,
	logout: PropTypes.func.isRequired,
	fetch: PropTypes.func.isRequired,
	onToggleSidebar: PropTypes.func.isRequired,
};

Header.defaultProps = {
	balances: null,
	data: null,
};

export default withRouter(connect(
	(state, ownProps) => ({
		balances: state.echojs.getIn(['data', 'accounts', ownProps.curentUserId, 'balances']),
		data: state.echojs.getIn(['data']).toJS(),
	}),
	(dispatch) => ({
		logout: () => dispatch(logout()),
		fetch: (id) => dispatch(EchoJSActions.fetch(id)),
	}),
)(Header));
