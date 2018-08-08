import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MODAL_TOKENS } from '../../constants/ModalConstants';
import formatAmount from '../../helpers/HistoryHelper';
import { openModal } from '../../actions/ModalActions';
import { removeToken } from '../../actions/BalanceActions';

class Tokens extends React.Component {

	onRemoveToken(id) {
		this.props.removeToken(id);
	}

	showTokensModal() {
		this.props.openModal(MODAL_TOKENS);
	}

	renderEmpty() {
		return (
			<Table.Row className="msg-empty">
				<Table.Cell>There is no Tokens yet...</Table.Cell>
			</Table.Row>
		);
	}

	renderList() {
		return this.props.tokens.map(({
			id, symbol, precision, balance,
		}) => (
			<Table.Row key={id}>
				<Table.Cell>{symbol}</Table.Cell>
				<Table.Cell>
					{formatAmount(balance, precision, '')}
					<span
						className="icon-close"
						role="button"
						onClick={(e) => this.onRemoveToken(id, e)}
						onKeyPress={(e) => this.onRemoveToken(id, e)}
						tabIndex="0"
					/>
				</Table.Cell>
			</Table.Row>
		));
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
									<div className="col-title">Assets</div>
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
						{
							!this.props.tokens || !this.props.tokens.size ?
								this.renderEmpty() : this.renderList()
						}
					</Table.Body>
				</Table>
			</div>
		);
	}

}

Tokens.propTypes = {
	tokens: PropTypes.object,
	openModal: PropTypes.func.isRequired,
	removeToken: PropTypes.func.isRequired,
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
	}),
)(Tokens);
