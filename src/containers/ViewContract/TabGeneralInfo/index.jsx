import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button, Dropdown } from 'semantic-ui-react';
import classnames from 'classnames';

import ActionBtn from '../../../components/ActionBtn';
import { formatAbi } from '../../../actions/ContractActions';
import { clearForm } from '../../../actions/FormActions';

import { FORM_VIEW_CONTRACT } from '../../../constants/FormConstants';
import { ECHO_ASSET_ID } from '../../../constants/GlobalConstants';

class TabGeneralInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
	}

	componentWillMount() {
		this.props.formatAbi(this.props.match.params.id);
	}

	componentWillUnmount() {
		this.props.clearForm(FORM_VIEW_CONTRACT);
	}


	showBalance(balance) {

		const balances = balance
			.filter(({ amount, id: assetId }) => amount !== '0' || (amount === '0' && assetId === ECHO_ASSET_ID));

		if (balances.length === 0) {
			return { mainBalance: {}, otherBalances: [] };
		}

		if (balances.length === 1) {
			return { mainBalance: balances[0], otherBalances: [] };
		}

		const coreAsset = balances.findIndex(({ amount, id: assetId }) => amount !== '0' && assetId === ECHO_ASSET_ID);

		if (coreAsset !== -1) {
			return {
				mainBalance: balances[coreAsset],
				otherBalances: balances.filter((_, i) => i !== coreAsset),
			};
		}

		const anotherNotNullBalance = balances.find(({ amount, id: assetId }) => amount !== '0' && assetId !== ECHO_ASSET_ID);

		if (anotherNotNullBalance !== -1) {
			return {
				mainBalance: balances[anotherNotNullBalance],
				otherBalances: balances.filter((_, i) => i !== anotherNotNullBalance),
			};
		}

		return { mainBalance: balances[0], otherBalances: balances.filter((_, i) => i !== 0) };
	}

	renderList(balances) {
		return balances.map(({
			symbol,
			amount,
		}) => {
			const content = (
				<div className="balance-wrap">
					<div className="balance">{amount}</div>
					<div className="coin">{symbol}</div>
				</div>
			);

			return ({
				value: symbol,
				key: symbol,
				content,
			});
		});
	}

	renderDropdownTrigger() {
		return (
			<div className="dropdown-trigger">
				<div className="content">Other Assets Balance</div>
				<span className="icon dropdown" />
			</div>
		);
	}

	render() {
		const { open } = this.state;
		const { bytecode, abi, balances } = this.props;
		const { mainBalance, otherBalances } = this.showBalance(balances);

		return (
			<div className="tab-content">
				<table className="table-key-value">
					<tbody>
						<tr>
							<td className="key">Contract Balance:</td>
							<td className="val">
								<div className="val-wrap">
									<div className="balance-wrap">
										<div className="balance">{mainBalance.amount}</div>
										<div className="coin">{mainBalance.symbol}</div>
									</div>
									{
										otherBalances.length && (
											<Dropdown
												open={open}
												onFocus={() => { this.setState({ open: true }); }}
												onBlur={() => { this.setState({ open: false }); }}
												icon={false}
												disabled={otherBalances.length === 0}
												className={classnames('assets-balance-dropdown', { empty: otherBalances.length === 0 })}
												options={otherBalances.length === 0 ? [] : this.renderList(otherBalances)}
												selectOnBlur={false}
												trigger={this.renderDropdownTrigger()}
											/>
										)
									}
								</div>
							</td>
						</tr>
						<tr>
							<td className="key">Fee Pool:</td>
							<td className="val">
								<div className="val-wrap">
									<div className="balance-wrap">
										<div className="balance">0</div>
										<div className="coin">ECHO</div>
									</div>
									<Button
										className="main-btn"
										size="small"
										content="Replenish"
									/>
								</div>
							</td>
						</tr>
						<tr>
							<td className="key">Whitelist:</td>
							<td className="val">
								<button className="link-btn">4 members</button>
							</td>
						</tr>
						<tr>
							<td className="key">Blacklist:</td>
							<td className="val">
								<button className="link-btn">Add account</button>
								<div className="val-hint">(List is empty)</div>
							</td>
						</tr>
						<tr>
							<td className="key">Bytecode:</td>
							<td className="val">
								<div className="field">
									<textarea
										type="text"
										placeholder="Bytecode"
										className="code"
										value={bytecode}
										readOnly
									/>
									<ActionBtn
										copy={bytecode}
										icon="icon-copy"
										text="Copy"
									/>
								</div>
							</td>
						</tr>
						<tr>
							<td className="key">ABI:</td>
							<td className="val">
								<div className="field">
									<textarea
										type="text"
										placeholder="Bytecode"
										className="code"
										value={abi}
										readOnly
									/>
									<ActionBtn
										copy={abi}
										icon="icon-copy"
										text="Copy"
									/>
								</div>
							</td>
						</tr>

					</tbody>
				</table>
			</div>
		);
	}

}


TabGeneralInfo.propTypes = {
	abi: PropTypes.string.isRequired,
	bytecode: PropTypes.string.isRequired,
	balances: PropTypes.array.isRequired,
	match: PropTypes.object.isRequired,
	formatAbi: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		abi: state.contract.get('abi'),
		bytecode: state.contract.get('bytecode'),
		balances: state.contract.get('balances'),
	}),
	(dispatch) => ({
		formatAbi: (id) => dispatch(formatAbi(id)),
		clearForm: (value) => dispatch(clearForm(value)),
	}),
)(TabGeneralInfo));
