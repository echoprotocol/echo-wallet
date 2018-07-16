import React from 'react';
import { Table, Segment, Sidebar } from 'semantic-ui-react';
import { connect } from 'react-redux';

import SidebarMenu from '../../components/SideMenu/index';
import Header from '../../components/Header/index';
import Footer from '../../components/Footer/index';

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

	render() {
		return (
			<Sidebar.Pushable as={Segment}>
				<SidebarMenu visibleBar={this.state.visibleBar} onToggleSidebar={this.toggleSidebar} />
				<Sidebar.Pusher onClick={this.sidebarHide} dimmed={this.state.visibleBar}>
					<Segment basic className="wrapper">
						<Header onToggleSidebar={this.toggleSidebar} />
						<div className="content center-mode ">
							<div>
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
											Array(23).fill().map((a, i) => {
												const id = i;
												return (
													<Table.Row key={id}>
														<Table.Cell>
															{/*
                                                        label-operation can be yellow (Place order)
                                                        / red (Cancel order) / green (Transfer)
                                                        */}
															<span className="label-operation yellow">
                                                                Place order
															</span>
														</Table.Cell>
														<Table.Cell>#22577382</Table.Cell>
														<Table.Cell>Awareed36</Table.Cell>
														<Table.Cell>
															<span className="ellips">
                                                                StanDPowell123
															</span>
														</Table.Cell>
														<Table.Cell>2.276365136 ETH</Table.Cell>
														<Table.Cell>0.00006983</Table.Cell>
														<Table.Cell>
															{/* can be success (Success) / fall (Fall) */}
															<span className="success">Success</span>
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

							</div>
						</div>
						<Footer />
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}

}

export default connect()(Activity);
