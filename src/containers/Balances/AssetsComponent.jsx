import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

class Assets extends React.Component {

	render() {
		return (
			<div className="table-assets">
				<div className="thead-wrap">
					<Table className="thead" unstackable>
						<Table.Body>
							<Table.Row>
								<Table.Cell>
									<div className="table-title">Assets</div>
									<div className="col-title">Assets</div>
								</Table.Cell>
								<Table.Cell>
									{/* <Button content="Add Asset" compact /> */}
									<div className="col-title">Total amount</div>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</div>
				<Table className="tbody" unstackable>
					<Table.Body>
						{/*
                            IF ASSETS IS EMPTY":
                            <Table.Row className="msg-empty">
                                <Table.Cell>There is no Assets yet...</Table.Cell>
                            </Table.Row>
                        */}
						<Table.Row>
							<Table.Cell>ECHO</Table.Cell>
							<Table.Cell>
                                8 186 877 940.0147
								<span className="icon-close" />
							</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>myEcho</Table.Cell>
							<Table.Cell>
                                8 186 877 940.0147
								<span className="icon-close" />
							</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>ethEcho</Table.Cell>
							<Table.Cell>
                                8 186 877 940.0147
								<span className="icon-close" />
							</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>myEcho</Table.Cell>
							<Table.Cell>
                                8 186 877 940.0147
								<span className="icon-close" />
							</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>myEcho ID</Table.Cell>
							<Table.Cell>
                                8 186 877 940.0147
								<span className="icon-close" />
							</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>myEcho</Table.Cell>
							<Table.Cell>
                                8 186 877 940.0147
								<span className="icon-close" />
							</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>myEcho</Table.Cell>
							<Table.Cell>
                                8 186 877 940.0147
								<span className="icon-close" />
							</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
			</div>
		);
	}

}

export default connect()(Assets);

