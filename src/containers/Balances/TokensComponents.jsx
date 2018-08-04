import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MODAL_TOKENS } from '../../constants/ModalConstants';
import { openModal } from '../../actions/ModalActions';
import formatAmount from '../../helpers/HistoryHelper';


class Tokens extends React.Component {

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
					<span className="icon-close" />
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
						{ !this.props.tokens ? this.renderEmpty() : this.renderList() }
					</Table.Body>
				</Table>
			</div>
		);
	}

}

Tokens.propTypes = {
	tokens: PropTypes.object,
	openModal: PropTypes.func.isRequired,
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
	}),
)(Tokens);
