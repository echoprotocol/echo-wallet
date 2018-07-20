import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MODAL_TOKENS } from '../../constants/ModalConstants';
import { openModal } from '../../actions/ModalActions';


class Tokens extends React.Component {

	showTokensModal() {
		this.props.openModal(MODAL_TOKENS);
	}

	render() {
		return (
			<div className="table-tokens">
				<div className="thead-wrap">
					<Table className="thead" unstackable>
						<Table.Body>
							<Table.Row>
								<Table.Cell>
									<div className="table-title">Tokens</div>
									<div className="col-title">Tokens</div>
								</Table.Cell>
								<Table.Cell>
									<Button onClick={() => this.showTokensModal()} compact>Watch Tokens</Button>
									<div className="col-title">Total amount</div>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</div>
				<Table className="tbody" unstackable>
					<Table.Body>
						{/*
                            IF TOKENS IS EMPTY":
                            <Table.Row className="msg-empty">
                                <Table.Cell>There is no Tokens yet...</Table.Cell>
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

Tokens.propTypes = {
	openModal: PropTypes.func.isRequired,
};


export default connect(
	() => ({}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
	}),
)(Tokens);
