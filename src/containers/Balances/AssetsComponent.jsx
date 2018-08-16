import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { formatAmount } from '../../helpers/FormatHelper';
import { redirectToTransfer } from '../../actions/BalanceActions';

class Assets extends React.Component {

	toTransfer(symbol) {
		this.props.redirectToTransfer(symbol);
	}

	renderEmpty() {
		return (
			<div className="msg-empty">
				<h3>You have no assets</h3>
			</div>
		);
	}

	renderList() {

		return (
			<React.Fragment>
				<div className="thead-wrap">

					<div className="thead-info">
						<div className="table-title">Assets</div>
					</div>

					<Table className="thead" unstackable>
						<Table.Body>
							<Table.Row>
								<Table.Cell>
                                    Assets
									{/* <div className="col-title">Assets</div> */}
								</Table.Cell>
								<Table.Cell>
                                    Total amount
									{/* <div className="col-title">Total amount</div> */}
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</div>
				<Table className="tbody" unstackable>
					<Table.Body>
						{

							this.props.assets.map((asset, i) => {
								const id = i;
								return (
									<Table.Row key={id} onClick={() => this.toTransfer(asset)}>
										<Table.Cell>{asset.symbol}</Table.Cell>
										<Table.Cell>
											{formatAmount(asset.balance, asset.precision, '')}
										</Table.Cell>
									</Table.Row>
								);

							})
						}
					</Table.Body>
				</Table>
			</React.Fragment>
		);
	}

	render() {
		return (
			<div className="table-assets">

				{
					!this.props.assets || !this.props.assets.size ?
						this.renderEmpty() : this.renderList()
				}
			</div>
		);
	}

}

Assets.propTypes = {
	assets: PropTypes.any,
	redirectToTransfer: PropTypes.func.isRequired,
};

Assets.defaultProps = {
	assets: null,
};

export default connect(
	(state) => ({
		assets: state.balance.get('assets'),
	}),
	(dispatch) => ({
		redirectToTransfer: (asset) => dispatch(redirectToTransfer(asset, 'assets')),
	}),
)(Assets);
