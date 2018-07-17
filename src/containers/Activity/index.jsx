import React from 'react';
import { Message, Table, Segment, Sidebar } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SidebarMenu from '../../components/SideMenu/index';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';

import { formatOperation } from '../../helpers/OperationsHistoryHelper'

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
						{/*<Table.HeaderCell>Time (UTC)</Table.HeaderCell>*/}
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
										<span className="label-operation yellow">
											{op.operation}
										</span>
									</Table.Cell>
									<Table.Cell>#</Table.Cell>
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
                                    {/*<Table.Cell>
										<span className="date">June 25, 2018</span>
										<span className="time">17:01:24 AM</span>
									</Table.Cell>*/}
								</Table.Row>
                            );
						})
                    }
				</Table.Body>
			</Table>
		);
	}

    renderEmptyTableMessage() {
		return (
			<Message info>
				<Message.Header>You have no transaction history yet or account does not loaded</Message.Header>
			</Message>
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
							<div>
								{this.props.history ? this.renderTable() : this.renderEmptyTableMessage() }

							</div>
						</div>
						<Footer />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}

}

Footer.propTypes = {
    history: PropTypes.any.isRequired,
};

export default connect((state) => ({
    history: state.echojs.getIn(['userData', 'account', 'history']),
}))(Activity);
