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

		return (
			<div className="tab-content">
				<div className="watchlist">
					{constants.toJS().length ? constants.toJS().map((constant, index) => {
						const id = index;

						let typeOptions = [
							{
								text: constant.outputs[0].type === 'string' ? 'string' : 'number',
								value: constant.outputs[0].type === 'string' ? 'string' : 'number',
							},
							{
								text: 'hex',
								value: 'hex',
							},
						];

						if (constant.outputs[0].type === 'bool') {
							typeOptions = [
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
						}

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
