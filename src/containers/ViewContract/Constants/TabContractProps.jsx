import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { formatAbi } from '../../../actions/ContractActions';

import ConstantLine from './ConstantLine';
import InputLine from './InputLine';

class TabContractProps extends React.Component {

	componentDidMount() {
		const contractName = this.props.location.pathname.split('/')[2];
		this.props.formatAbi(contractName, true);
	}

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
	location: PropTypes.object.isRequired,
	formatAbi: PropTypes.func.isRequired,
};

TabContractProps.defaultProps = {
	constants: null,
};

export default withRouter(connect(
	(state) => ({
		constants: state.contract.get('constants'),
	}),
	(dispatch) => ({
		formatAbi: (name, isConst) => dispatch(formatAbi(name, isConst)),
	}),
)(TabContractProps));
