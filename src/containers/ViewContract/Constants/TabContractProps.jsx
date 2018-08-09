import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { formatAbi } from '../../../actions/ContractActions';

import ConstantLine from './ConstantLine';
import InputLine from './InputLine';

class TabContractProps extends React.Component {

	componentDidMount() {
		this.props.formatAbi('1.16.0', true);
	}
	// ? this.renderConstantLine(typeOptions)
	// 		: this.renderInputLine(typeOptions)
	render() {
		const { constants } = this.props;
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
		return (
			<div className="tab-content">
				<div className="watchlist">
					{constants.toJS().length ? constants.toJS().map((constant, index) => {
						const id = index;
						console.log(constant);
						if (constant.inputs.length) {
							return (<InputLine key={id} typeOptions={typeOptions} constant={constant} />);
						}
						return (<ConstantLine key={id} typeOptions={typeOptions} constant={constant} />);
					}) : ''}
				</div>
			</div>
		);
	}

}

TabContractProps.propTypes = {
	constants: PropTypes.any,
	formatAbi: PropTypes.func.isRequired,
};

TabContractProps.defaultProps = {
	constants: null,
};

export default connect(
	(state) => ({
		constants: state.contract.get('constants'),
	}),
	(dispatch) => ({
		formatAbi: (id, isConst) => dispatch(formatAbi(id, isConst)),
	}),
)(TabContractProps);
