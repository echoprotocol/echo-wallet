import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import formatAmount from '../../helpers/HistoryHelper';
import { parseAssetsBalances } from '../../actions/BalanceActions';

class Assets extends React.Component {

	componentDidUpdate(prevProps) {
		const account = this.props.account ? this.props.account.toJS() : null;
		const oldAccount = prevProps.account ? prevProps.account.toJS() : null;

		if (!account || !account.balances || !this.props.statistics) {
			return;
		}

		if (!oldAccount || !oldAccount.balances) {
			this.props.formatAssetsBalances(account.balances);
			return;
		}

		if (!this.props.statistics.equals(prevProps.statistics)) {
			this.props.formatAssetsBalances(account.balances);
		}
	}

	renderEmpty() {
		return (
			<Table.Row className="msg-empty">
				<Table.Cell>There is no Assets yet...</Table.Cell>
			</Table.Row>
		);
	}

	renderList() {
		return this.props.assets.map((asset, i) => {
			const id = i;
			return (
				<Table.Row key={id}>
					<Table.Cell>{asset.symbol}</Table.Cell>
					<Table.Cell>
						{formatAmount(asset.balance, asset.precision, '')}
					</Table.Cell>
				</Table.Row>
			);
		});
	}

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
						{
							!this.props.assets || !this.props.assets.size ?
								this.renderEmpty() : this.renderList()
						}
					</Table.Body>
				</Table>
			</div>
		);
	}

}

Assets.propTypes = {
	account: PropTypes.any,
	assets: PropTypes.any,
	statistics: PropTypes.any,
	formatAssetsBalances: PropTypes.func.isRequired,
};

Assets.defaultProps = {
	assets: null,
	account: null,
	statistics: null,
};

export default connect(
	(state) => {
		const accountId = state.global.getIn(['activeUser', 'id']);
		const account = state.echojs.getIn(['data', 'accounts', accountId]);
		let statistics = null;
		if (account) {
			statistics = account
				.get('balances')
				.map((statistic) => state.echojs.getIn(['data', 'objects', statistic]))
				.toList();
		}

		const assets = state.balance.get('assets');
		return { account, assets, statistics };
	},
	(dispatch) => ({
		formatAssetsBalances: (value) => dispatch(parseAssetsBalances(value)),
	}),
)(Assets);
