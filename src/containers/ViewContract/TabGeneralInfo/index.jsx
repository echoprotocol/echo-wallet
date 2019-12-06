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
		const { bytecode, abi } = this.props;

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
	abi: PropTypes.string.isRequired,
	bytecode: PropTypes.string.isRequired,
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
