import React from 'react';
import PropTypes from 'prop-types';
import { CACHE_MAPS } from 'echojs-lib';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button, Dropdown } from 'semantic-ui-react';
import classnames from 'classnames';

import ActionBtn from '../../../components/ActionBtn';
import {
	initGeneralContractInfo,
	resetGeneralContractInfo,
} from '../../../actions/ContractActions';

class TabGeneralInfo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
	}

	componentDidMount() {
		this.props.initGeneralContractInfo(this.props.match.params.id);
	}

	componentWillUnmount() {
		this.props.resetGeneralContractInfo();
	}

	renderList() {
		const options = [
			{
				balance: 0.09297,
				coin: 'myEcho',
			},
			{
				balance: 0.02,
				coin: 'ethEcho',
			},
			{
				balance: 8.374,
				coin: 'ercToken',
			},
			{
				balance: 0.09297,
				coin: 'myEcho2',
			},
			{
				balance: 0.09297,
				coin: 'myEcho3',
			},
			{
				balance: 0.09297,
				coin: 'myEcho4',
			},
		];

		return options.map(({
			balance,
			coin,
		}) => {
			const content = (
				<div className="balance-wrap">
					<div className="balance">{balance}</div>
					<div className="coin">{coin}</div>
				</div>
			);

			return ({
				value: coin,
				key: coin,
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
		const bytecode = '608060405234801561001057600080fd5b506101a2806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630775107014610046575b600080fd5b34801561005257600080fd5b5061005b61005d565b005b60405180807f312e322e35206c69666574696d655f72656665727265725f6665655f7065726381526020017f656e746167650000000000000054600181600116156101000203166002900490629';
		const abi = '[\n {\n "constant": true,\n "inputs": [],\n "name": "name",\n "outputs": [\n {\n';


		return (
			<div className="tab-content">
				<table className="table-key-value">
					<tbody>
						<tr>
							<td className="key">Contract Balance:</td>
							<td className="val">
								<div className="val-wrap">
									<div className="balance-wrap">
										<div className="balance">0.0038</div>
										<div className="coin">ECHO</div>
									</div>

									<Dropdown
										open={open}
										onFocus={() => { this.setState({ open: true }); }}
										onBlur={() => { this.setState({ open: false }); }}
										icon={false}
										disabled={this.renderList().length < 2}
										className={classnames('assets-balance-dropdown', { empty: this.renderList().length < 2 })}
										options={this.renderList().length < 2 ? [] : this.renderList()}
										selectOnBlur={false}
										trigger={this.renderDropdownTrigger()}
									/>
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
	contract: PropTypes.object,
	match: PropTypes.object.isRequired,
	initGeneralContractInfo: PropTypes.func.isRequired,
	resetGeneralContractInfo: PropTypes.func.isRequired,
};

TabGeneralInfo.defaultProps = {
	contract: null,
};

export default withRouter(connect(
	(state, ownProps) => ({
		contract: state.echojs.getIn([
			CACHE_MAPS.FULL_CONTRACTS_BY_CONTRACT_ID,
			ownProps.match.params.id,
		]),
	}),
	(dispatch) => ({
		initGeneralContractInfo: (contractId) => dispatch(initGeneralContractInfo(contractId)),
		resetGeneralContractInfo: () => dispatch(resetGeneralContractInfo()),
	}),
)(TabGeneralInfo));
