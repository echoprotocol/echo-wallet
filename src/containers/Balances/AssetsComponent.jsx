import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import formatAmount from '../../helpers/HistoryHelper';

class Assets extends React.Component {

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
						<span className="icon-close" />
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
	assets: PropTypes.any,
};

Assets.defaultProps = {
	assets: null,
};

export default connect((state) => ({
	assets: state.balance.get('assets'),
}))(Assets);
