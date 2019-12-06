import React from 'react';
import PropTypes from 'prop-types';
import { CACHE_MAPS } from 'echojs-lib';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button, Dropdown } from 'semantic-ui-react';
import classnames from 'classnames';
import _ from 'lodash';

import ModalToWhitelist from '../../../components/Modals/ModalToWhitelist';
import ModalToBlacklist from '../../../components/Modals/ModalToBlacklist';
import ModalWhitelist from '../../../components/Modals/ModalWhitelist';
import ModalBlacklist from '../../../components/Modals/ModalBlacklist';
import ActionBtn from '../../../components/ActionBtn';
import {
	initGeneralContractInfo,
	resetGeneralContractInfo,
	updateGeneralContractInfo,
	formatAbi,
} from '../../../actions/ContractActions';
import { clearForm } from '../../../actions/FormActions';
import { FORM_VIEW_CONTRACT } from '../../../constants/FormConstants';
import { ECHO_ASSET_ID, ADDRESS_PREFIX } from '../../../constants/GlobalConstants';
import { formatAmount } from '../../../helpers/FormatHelper';
import { openModal } from '../../../actions/ModalActions';
import { MODAL_REPLENISH } from '../../../constants/ModalConstants';


class TabGeneralInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
	}

	componentDidMount() {
		this.props.initGeneralContractInfo(this.props.match.params.id);
		this.props.formatAbi(this.props.match.params.id);
	}

	async componentDidUpdate(prevProps) {
		if (!prevProps.contract || !this.props.contract) {
			return;
		}

		if (!_.isEqual(prevProps.contract, this.props.contract)) {
			this.props.formatAbi(this.props.match.params.id);
			if (prevProps.contract) {
				await updateGeneralContractInfo(this.props.contract);
			}
		}
	}

	componentWillUnmount() {
		this.props.resetGeneralContractInfo();
		this.props.clearForm(FORM_VIEW_CONTRACT);
	}

	getPoolAmount() {
		const { contract, poolAsset } = this.props;

		if (!contract || !poolAsset) {
			return null;
		}

		return formatAmount(
			contract.getIn(['poolBalance', 'amount']),
			poolAsset.get('precision'),
		);
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
				otherBalances: balances.filter((__, i) => i !== coreAsset),
			};
		}

		const anotherNotNullBalance = balances.find(({ amount, id: assetId }) => amount !== '0' && assetId !== ECHO_ASSET_ID);

		if (anotherNotNullBalance !== -1) {
			return {
				mainBalance: balances[anotherNotNullBalance],
				otherBalances: balances.filter((__, i) => i !== anotherNotNullBalance),
			};
		}

		return { mainBalance: balances[0], otherBalances: balances.filter((__, i) => i !== 0) };
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
		const { poolAsset } = this.props;
		const { open } = this.state;
		const {
			bytecode, abi, balances, contract, owner, activeUser, loading,
		} = this.props;
		const { mainBalance, otherBalances } = this.showBalance(balances);
		if (!contract) {
			return null;
		}
		return (
			<React.Fragment>
				<ModalToWhitelist />
				<ModalToBlacklist />
				<ModalWhitelist />
				<ModalBlacklist />
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
											otherBalances.length > 0 && (
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
											<div className="balance">{this.getPoolAmount() || '0'}</div>
											<div className="coin">{poolAsset ? poolAsset.get('symbol') : ADDRESS_PREFIX}</div>
										</div>
										<Button
											className="main-btn"
											size="small"
											content="Replenish"
											onClick={() => this.props.openModal(
												MODAL_REPLENISH,
												{ contractId: this.props.match.params.id },
											)}
										/>
									</div>
								</td>
							</tr>
							<tr>
								<td className="key">Whitelist:</td>
								<td className="val">
									{
										(contract.get('whitelist') && contract.get('whitelist').size) ?
											<button
												className="link-btn"
												onClick={this.props.openWhitelistModal}
												disabled={loading}
											>
												{contract.get('whitelist').size} members
											</button> :
											<React.Fragment>
												{
													owner === activeUser ?
														<React.Fragment>
															<button
																className="link-btn"
																onClick={this.props.openToWhitelistModal}
																disabled={loading}
															>
																Add account
															</button>
															<div className="val-hint">(List is empty)</div>
														</React.Fragment> :
														<div className="val-hint">List is empty</div>
												}
											</React.Fragment>
									}
								</td>
							</tr>
							<tr>
								<td className="key">Blacklist:</td>
								<td className="val">
									{
										(contract.get('blacklist') && contract.get('blacklist').size) ?
											<button
												className="link-btn"
												onClick={this.props.openBlacklistModal}
												disabled={loading}
											>
												{contract.get('blacklist').size} members
											</button> :
											<React.Fragment>
												{
													owner === activeUser ?
														<React.Fragment>
															<button
																className="link-btn"
																onClick={this.props.openToBlacklistModal}
																disabled={loading}
															>
																Add account
															</button>
															<div className="val-hint">(List is empty)</div>
														</React.Fragment> :
														<div className="val-hint">List is empty</div>
												}
											</React.Fragment>
									}
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
			</React.Fragment>
		);
	}

}

TabGeneralInfo.propTypes = {
	abi: PropTypes.string.isRequired,
	bytecode: PropTypes.string.isRequired,
	balances: PropTypes.array.isRequired,
	contract: PropTypes.object,
	poolAsset: PropTypes.object,
	match: PropTypes.object.isRequired,
	initGeneralContractInfo: PropTypes.func.isRequired,
	resetGeneralContractInfo: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
	owner: PropTypes.string.isRequired,
	activeUser: PropTypes.string.isRequired,
	loading: PropTypes.bool.isRequired,
	formatAbi: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
	openWhitelistModal: PropTypes.func.isRequired,
	openBlacklistModal: PropTypes.func.isRequired,
	openToWhitelistModal: PropTypes.func.isRequired,
	openToBlacklistModal: PropTypes.func.isRequired,
};

TabGeneralInfo.defaultProps = {
	contract: null,
	poolAsset: null,
};

export default withRouter(connect(
	(state, ownProps) => {
		const contract = state.echojs.getIn([
			CACHE_MAPS.FULL_CONTRACTS_BY_CONTRACT_ID,
			ownProps.match.params.id,
		]);
		const poolAsset = contract && state.echojs.getIn([
			CACHE_MAPS.ASSET_BY_ASSET_ID,
			contract.getIn(['poolBalance', 'asset_id']),
		]);
		return {
			contract,
			poolAsset,
			abi: state.contract.get('abi'),
			bytecode: state.contract.get('bytecode'),
			balances: state.contract.get('balances'),
			loading: state.contract.get('loading'),
		};
	},
	(dispatch) => ({
		initGeneralContractInfo: (contractId) => dispatch(initGeneralContractInfo(contractId)),
		resetGeneralContractInfo: () => dispatch(resetGeneralContractInfo()),
		openModal: (value, params) => dispatch(openModal(value, params)),
		formatAbi: (id) => dispatch(formatAbi(id)),
		clearForm: (value) => dispatch(clearForm(value)),
	}),
)(TabGeneralInfo));
