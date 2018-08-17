import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MODAL_TOKENS } from '../../constants/ModalConstants';

import { openModal } from '../../actions/ModalActions';
import { formatAmount } from '../../helpers/FormatHelper';

import { disableToken } from '../../actions/BalanceActions';

class Tokens extends React.Component {

	onRemoveToken(name, id) {
		this.props.removeToken(name, id);
	}

	showTokensModal() {
		this.props.openModal(MODAL_TOKENS);
	}

	renderEmpty() {
		return (
			<div className="table-tokens">
				<div className="msg-empty">
					<h3>You have no tokens</h3>
					<Button onClick={() => this.showTokensModal()} compact>Watch Tokens</Button>
				</div>
			</div>
		);
	}

	renderList() {
		return (
			<div className="table-tokens">
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
				<Table className="tbody" unstackable>
					<Table.Body>
						{
							this.props.tokens.map(({
								id, symbol, precision, balance,
							}) => (
								<Table.Row key={id}>
									<Table.Cell>{symbol}</Table.Cell>
									<Table.Cell>
										{formatAmount(balance, precision, '')}
										<span
											className="icon-close"
											role="button"
											onClick={(e) => this.onRemoveToken(symbol, id, e)}
											onKeyPress={(e) => this.onRemoveToken(symbol, id, e)}
											tabIndex="0"
										/>
									</Table.Cell>
								</Table.Row>
							))
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
		removeToken: (name, id) => dispatch(disableToken(name, id)),
	}),
)(Tokens);
