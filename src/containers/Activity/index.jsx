import React from 'react';
import { Table, Segment, Sidebar } from 'semantic-ui-react';
import { connect } from 'react-redux';

import SidebarMenu from '../../components/layout/SidebarMenu';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

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
											<Table.HeaderCell>Free</Table.HeaderCell>
											<Table.HeaderCell>Status</Table.HeaderCell>
											<Table.HeaderCell>Time (UTC)</Table.HeaderCell>
										</Table.Row>
									</Table.Header>

									<Table.Body>
										<Table.Row>
											<Table.Cell>
												<span className="label-operation yellow">
									Place order
												</span>
											</Table.Cell>
											<Table.Cell>2</Table.Cell>
											<Table.Cell>3</Table.Cell>
											<Table.Cell>4</Table.Cell>
											<Table.Cell>5</Table.Cell>
											<Table.Cell>6</Table.Cell>
											<Table.Cell><span className="success">Success</span></Table.Cell>
											<Table.Cell>8</Table.Cell>
										</Table.Row>
										<Table.Row>
											<Table.Cell>
												<span className="label-operation red">
									Cancel order
												</span>
											</Table.Cell>
											<Table.Cell>2</Table.Cell>
											<Table.Cell>3</Table.Cell>
											<Table.Cell>4</Table.Cell>
											<Table.Cell>5</Table.Cell>
											<Table.Cell>6</Table.Cell>
											<Table.Cell><span className="fall">Fall</span></Table.Cell>
											<Table.Cell>8</Table.Cell>
										</Table.Row>
										<Table.Row>
											<Table.Cell>
												<span className="label-operation green">
									transfer
												</span>
											</Table.Cell>
											<Table.Cell>2</Table.Cell>
											<Table.Cell>3</Table.Cell>
											<Table.Cell>4</Table.Cell>
											<Table.Cell>5</Table.Cell>
											<Table.Cell>6</Table.Cell>
											<Table.Cell><span className="fall">Fall</span></Table.Cell>
											<Table.Cell>
												<span className="date">May 31, 2018</span>
												<span className="time">11:51:22 AM</span>
											</Table.Cell>
										</Table.Row>
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
