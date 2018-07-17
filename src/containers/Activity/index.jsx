import React from 'react';
import { Table, Segment, Sidebar, Dimmer, Loader } from 'semantic-ui-react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SidebarMenu from '../../components/SideMenu/index';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';

import formatOperation from '../../helpers/OperationsHistoryHelper';

class Activity extends React.Component {

	constructor() {
		super();
		this.state = { visibleBar: false };
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.sidebarHide = this.sidebarHide.bind(this);
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
						<Table.HeaderCell>To</Table.HeaderCell>
						<Table.HeaderCell>Value</Table.HeaderCell>
						<Table.HeaderCell>Fee</Table.HeaderCell>
						<Table.HeaderCell>Status</Table.HeaderCell>
						<Table.HeaderCell>Time (UTC)</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{
						this.props.history.map((h, i) => {
							const id = i;
							const op = formatOperation(h);
							return (
								<Table.Row key={id}>
									<Table.Cell>
										{/*
										 label-operation can be yellow (Place order)
										 / red (Cancel order) / green (Transfer)
										 */}
										<span className="label-operation green">
											{op.operation}
										</span>
									</Table.Cell>
									<Table.Cell>#{op.block}</Table.Cell>
									<Table.Cell>{op.from}</Table.Cell>
									<Table.Cell>
										<span className="ellips">
											{op.to}
										</span>
									</Table.Cell>
									<Table.Cell>{op.value}</Table.Cell>
									<Table.Cell>{op.fee}</Table.Cell>
									<Table.Cell>
										{/* can be success (Success) / fall (Fall) */}
										<span className="success">{op.status}</span>
									</Table.Cell>
									<Table.Cell>
										<span className="date">June 25, 2018</span>
										<span className="time">17:01:24 AM</span>
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
								!this.props.history ?
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
};

Activity.defaultProps = {
	history: null,
};


export default connect((state) => ({
	history: state.echojs.getIn(['userData', 'account', 'history']),
}))(Activity);
