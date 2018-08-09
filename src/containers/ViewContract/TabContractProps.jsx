import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { formatAbi } from '../../actions/ContractActions';

class TabContractProps extends React.Component {

	// componentWillReceiveProps(nextProps) {
	// 	if (nextProps.accountId) {
	// 		this.props.formatAbi('1.16.92', true);
	// 	}
	// }

	shouldComponentUpdate(nextProps) {
		if (nextProps.accountId) {
			this.props.formatAbi('1.16.92', true);
			return true;
		}
		return false;
	}

	renderConstant(typeOptions) {
		return (
			<div className="watchlist-line">
				<div className="watchlist-row">
					<span className="row-title"> name </span>
				</div>
				<div className="watchlist-row">
					<div className="watchlist-col">
						<span className="icon-dotted" />
					</div>
					<div className="watchlist-col">
						<Dropdown
							placeholder="Empty"
							compact
							selection
							className="item contract-type-dropdown air"
							options={typeOptions}
						/>
						{/* Можно добавить класс blue */}
						<span className="value blue item">
                                0x0000000000000000000000000000000000000000000000000000000000000000
						</span>
					</div>
				</div>
			</div>
		);
	}

	renderInput(typeOptions) {
		return (
			<div className="watchlist-line">
				<div className="watchlist-row">
					<span className="row-title"> name </span>
				</div>
				<div className="watchlist-row">
					<div className="watchlist-col">
						<span className="icon-dotted" />
					</div>
					<div className="watchlist-col">
						<Dropdown
							placeholder="Empty"
							compact
							selection
							className="item contract-type-dropdown air"
							options={typeOptions}
						/>
						<Input className="item" size="mini" placeholder="guy (address)" />
						<span className="comma item">,</span>
						<Input className="item" size="mini" placeholder="wad (unit256)" />
						<Button className="item" size="mini" content="call" />
					</div>
				</div>
			</div>
		);
	}

	render() {
		console.log(this.props.accountId);
		// console.log(this.props.constants.toJS());

		const { constants } = this.props;
		console.log(constants.toJS());

		const typeOptions = [
			{
				text: 'unit256',
				value: 'unit256',
			},
			{
				text: 'bytes32',
				value: 'bytes32',
			},
			{
				text: 'address',
				value: 'address',
			},
		];
		// {constants.map((h, i) => {
		//
		// })}
		return (
			<div className="tab-content">
				<div className="watchlist">
					{this.renderConstant(typeOptions)}
					{this.renderInput(typeOptions)}
				</div>
			</div>
		);
	}

}

TabContractProps.propTypes = {
	accountId: PropTypes.any,
	constants: PropTypes.object,
	formatAbi: PropTypes.func.isRequired,
};

TabContractProps.defaultProps = {
	accountId: null,
	constants: [],
};

export default connect(
	(state) => ({
		accountId: state.global.getIn(['activeUser', 'id']),
		constants: state.contract.get('constants'),
	}),
	(dispatch) => ({
		formatAbi: (contractId, isConst) => dispatch(formatAbi(contractId, isConst)),
	}),
)(TabContractProps);
