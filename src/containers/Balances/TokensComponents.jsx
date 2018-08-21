import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MODAL_TOKENS } from '../../constants/ModalConstants';

import { openModal } from '../../actions/ModalActions';
import { formatAmount } from '../../helpers/FormatHelper';
import { removeToken, redirectToTransfer } from '../../actions/BalanceActions';

class Tokens extends React.Component {

	onRemoveToken(id) {
		this.props.removeToken(id);
	}

	toTransfer(symbol) {
		this.props.redirectToTransfer(symbol);
	}

	showTokensModal() {
		this.props.openModal(MODAL_TOKENS);
	}

	renderEmpty() {
		return (
			<div className="msg-empty">
				<h3>You have no tokens</h3>
				<Button onClick={() => this.showTokensModal()} compact>Watch Tokens</Button>
			</div>
		);
	}

	renderList() {
		return (
			<React.Fragment>
				<div className="thead-wrap">
					<div className="thead-info">
						<div className="table-title">Tokens</div>
						<Button onClick={() => this.showTokensModal()} compact>Watch Tokens</Button>
					</div>
					<Table className="thead" unstackable>
						<Table.Body>
							<Table.Row>
								<Table.Cell>
                                    Tokens
									{/* <div className="col-title">Tokens</div> */}
								</Table.Cell>
								<Table.Cell>
                                    Total amount
									{/* <div className="col-title"></div> */}
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</div>
				<Table className="tbody tokens-balance-table" unstackable>
					<Table.Body>
						{
							this.props.tokens.map(({
								id, symbol, precision, balance,
							}) => (
								<Table.Row
									key={id}
									className="pointer"
								>
									<Table.Cell
										onClick={() => this.toTransfer({
											id, symbol, precision, balance,
										})}
									>
										{symbol}
									</Table.Cell>
									<Table.Cell
										onClick={() => this.toTransfer({
											id, symbol, precision, balance,
										})}
									>
										{formatAmount(balance, precision, '')}
									</Table.Cell>
									<Table.Cell
										onClick={(e) => this.onRemoveToken(id, e)}
										onKeyPress={(e) => this.onRemoveToken(id, e)}
									>
										<span className="icon-close" />
									</Table.Cell>
								</Table.Row>
							))
						}
					</Table.Body>
				</Table>
			</React.Fragment>
		);
	}

	render() {
		return (
			<div className="table-tokens">
				{
					!this.props.tokens || !this.props.tokens.size ?
						this.renderEmpty() : this.renderList()
				}
			</div>
		);
	}

}

Tokens.propTypes = {
	tokens: PropTypes.object,
	openModal: PropTypes.func.isRequired,
	removeToken: PropTypes.func.isRequired,
	redirectToTransfer: PropTypes.func.isRequired,
};

Tokens.defaultProps = {
	tokens: null,
};


export default connect(
	(state) => ({
		tokens: state.balance.get('tokens'),
	}),
	(dispatch) => ({
		openModal: (value) => dispatch(openModal(value)),
		removeToken: (value) => dispatch(removeToken(value)),
		redirectToTransfer: (token) => dispatch(redirectToTransfer(token, 'tokens')),
	}),
)(Tokens);
