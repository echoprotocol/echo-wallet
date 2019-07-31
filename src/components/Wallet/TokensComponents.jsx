import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { MODAL_TOKENS } from '../../constants/ModalConstants';

import { formatAmount } from '../../helpers/FormatHelper';

class Tokens extends React.Component {

	onRemoveToken(name, id) {
		this.props.removeToken(name, id);
	}

	setAsset(symbol) {
		this.props.setAsset(symbol);
	}

	showTokensModal() {
		this.props.openModal(MODAL_TOKENS);
	}

	renderEmpty() {
		return (
			<div className="table-tokens">
				<div className="msg-empty">
					<h3>You have no tokens</h3>
					<Button
						basic
						onClick={() => this.showTokensModal()}
						compact
						content="Watch Tokens"
						className="main-btn"
					/>
				</div>
			</div>
		);
	}

	renderRow({
		id, symbol, precision, balance, disabled,
	}) {
		if (disabled) return null;
		return (
			<Table.Row
				key={id}
				className="pointer"
			>
				<Table.Cell
					onClick={() => this.setAsset({
						id, symbol, precision, balance,
					})}
				>
					{symbol}
				</Table.Cell>
				<Table.Cell
					onClick={() => this.setAsset({
						id, symbol, precision, balance,
					})}
				>
					{formatAmount(balance, precision, '')}
				</Table.Cell>
				<Table.Cell
					onClick={(e) => this.onRemoveToken(symbol, id, e)}
					onKeyPress={(e) => this.onRemoveToken(symbol, id, e)}
				>
					<span className="icon-close" />
				</Table.Cell>
			</Table.Row>
		);
	}

	renderList() {
		return (
			<div className="table-tokens">
				<div className="thead-wrap">
					<div className="thead-info">
						<div className="table-title">Tokens</div>
						<Button
							basic
							onClick={() => this.showTokensModal()}
							compact
							content="Watch Tokens"
							className="main-btn"
						/>
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
							this.props.tokens.map((t) => this.renderRow(t))
						}
					</Table.Body>
				</Table>
			</div>
		);
	}

	render() {
		const { tokens } = this.props;

		if (!tokens || !tokens.size) {
			return this.renderEmpty();
		}

		const activeContracts = tokens.toJS().filter((i) => !i.disabled);

		return activeContracts.length ? this.renderList() : this.renderEmpty();
	}

}

Tokens.propTypes = {
	tokens: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	removeToken: PropTypes.func.isRequired,
	setAsset: PropTypes.func.isRequired,
};

export default Tokens;
