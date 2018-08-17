import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { formatAbi } from '../../../actions/ContractActions';

import ConstantLine from './LineComponent';

class TabContractProps extends React.Component {

	getOptions(type) {
		switch (type) {
			case 'bool': return [
				{
					text: 'bool',
					value: 'bool',
				},
				{
					text: 'number',
					value: 'number',
				},
				{
					text: 'hex',
					value: 'hex',
				},
			];
			case 'string':
			case 'address': return [
				{
					text: type === 'address' ? 'id' : type,
					value: type === 'address' ? 'number' : type,
				},
				{
					text: 'hex',
					value: 'hex',
				},
			];
			default: return [
				{
					text: 'number',
					value: 'number',
				},
				{
					text: 'hex',
					value: 'hex',
				},
			];
		}
	}

	render() {
		const { constants } = this.props;

		return (
			<div className="tab-content">
				<div className="watchlist">
					{constants.toJS().length ? constants.toJS().map((constant, index) => {
						const id = index;

						return (
							<ConstantLine
								key={id}
								typeOptions={this.getOptions(constant.outputs[0].type)}
								constant={constant}
							/>
						);
					}) : ''}
				</div>
			</div>
		);
	}

}

TabContractProps.propTypes = {
	constants: PropTypes.any,
};

TabContractProps.defaultProps = {
	constants: null,
};

export default withRouter(connect(
	(state) => ({
		constants: state.contract.get('constants'),
	}),
	(dispatch) => ({
		formatAbi: (name) => dispatch(formatAbi(name)),
	}),
)(TabContractProps));
