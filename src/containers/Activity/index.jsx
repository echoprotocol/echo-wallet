import React from 'react';
import accounting from 'accounting';
import { Table, Segment, Sidebar, Dimmer, Loader } from 'semantic-ui-react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SidebarMenu from '../../components/SideMenu/index';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';

import { setBodyTable } from '../../actions/TableActions';

class Activity extends React.Component {

	constructor() {
		super();
		this.state = { visibleBar: false };
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.sidebarHide = this.sidebarHide.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.history !== nextProps.history) {
			this.props.setBodyTable(nextProps.history);
			return true;
		} else if ((this.state.visibleBar !== nextState.visibleBar) && this.props.history) {
			return true;
		}
		return false;
	}

	changeLabelColor(fromAccount) {
		if (localStorage.getItem('current_account') === fromAccount) {
			return 'label-operation yellow';
		}
		return 'label-operation green';
	}

	toggleSidebar() {
		this.setState({ visibleBar: !this.state.visibleBar });
	}

	sidebarHide() {
		if (this.state.visibleBar) {
			this.setState({ visibleBar: false });
		}
	}

	renderTable() {
		return (
			<Table striped className="table-activity">
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Operation</Table.HeaderCell>
						<Table.HeaderCell>Block</Table.HeaderCell>
						<Table.HeaderCell>From</Table.HeaderCell>
						<Table.HeaderCell>Subject</Table.HeaderCell>
						<Table.HeaderCell>Value</Table.HeaderCell>
						<Table.HeaderCell>Fee</Table.HeaderCell>
						<Table.HeaderCell>Time</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{
						this.props.tableHistory.map((h, i) => {
							const id = i;
							return (
								<Table.Row key={id}>
									<Table.Cell>
										{/*
										 label-operation can be yellow (Place order)
										 / red (Cancel order) / green (Transfer)
										 */}
										<span className={this.changeLabelColor(h.from)}>
											{h.operation}
										</span>
									</Table.Cell>
									<Table.Cell>
										<span className="ellips">
                                            #{h.block}
										</span>
									</Table.Cell>
									<Table.Cell>
										<span className="ellips">
											{h.from}
										</span>
									</Table.Cell>
									<Table.Cell>
										<span className="ellips">
											{h.subject}
										</span>
									</Table.Cell>
									<Table.Cell>
										<span className="ellips">
											{
												h.value.amount
													? accounting.formatMoney(h.value.amount / (10 ** h.value.precision), h.value.symbol, h.value.precision, ' ', '.', '%v %s')
													: h.value.amount
											}
										</span>
									</Table.Cell>
									<Table.Cell>
										{
											h.fee.amount
												? accounting.formatMoney(h.fee.amount / (10 ** h.fee.precision), h.fee.symbol, h.fee.precision, ' ', '.', '%v %s')
												: h.fee.amount
										}
									</Table.Cell>
									<Table.Cell>
										<span className="date">{h.timestamp.date}</span>
										<span className="time">{h.timestamp.time}</span>
									</Table.Cell>
								</Table.Row>
							);
						})
					}
				</Table.Body>
			</Table>
		);
	}

	renderLoading() {
		return (
			<Dimmer inverted active>
				<Loader inverted content="" />
			</Dimmer>
		);
	}

	render() {
		return (
			<Sidebar.Pushable as={Segment}>
				<SidebarMenu visibleBar={this.state.visibleBar} onToggleSidebar={this.toggleSidebar} />
				<Sidebar.Pusher onClick={this.sidebarHide} dimmed={this.state.visibleBar}>
					<Segment basic className="wrapper">
						<Header onToggleSidebar={this.toggleSidebar} />
						<div className="content center-mode ">
							{
								!this.props.tableHistory ?
									this.renderLoading() :
									<div>
										{this.renderTable()}
									</div>
							}
						</div>
						<Footer />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}

}

Activity.propTypes = {
	history: PropTypes.any,
	tableHistory: PropTypes.any,
	setBodyTable: PropTypes.func.isRequired,
};

Activity.defaultProps = {
	history: null,
	tableHistory: null,
};


export default connect(
	(state) => ({
		history: state.echojs.getIn(['userData', 'account', 'history']),
		tableHistory: state.table.getIn(['activityBodyTable', 'history']),
	}),
	(dispatch) => ({
		setBodyTable: (value) => dispatch(setBodyTable(value)),
	}),
)(Activity);
