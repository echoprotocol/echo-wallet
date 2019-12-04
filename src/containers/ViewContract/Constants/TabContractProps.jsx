import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { formatAbi } from '../../../actions/ContractActions';
import { clearForm } from '../../../actions/FormActions';

import { FORM_VIEW_CONTRACT } from '../../../constants/FormConstants';

import ConstantLine from './LineComponent';

class TabContractProps extends React.Component {

	componentWillMount() {
		this.props.formatAbi(this.props.match.params.id);
	}

	componentWillUnmount() {
		this.props.clearForm(FORM_VIEW_CONTRACT);
	}

	getDefaultType(type) {

		if (type === 'bool') {
			return 'bool';
		} else if (type === 'string') {
			return 'string';
		} else if (type === 'address') {
			return 'id';
		} else if (type.includes('int')) {
			return 'number';
		}

		return 'hex';
	}

	getOptions(type) {
		switch (type) {
			case 'bool': return [
				{
					text: 'bool',
					value: 'bool',
				},
				{
					text: 'hex',
					value: 'hex',
				},
				{
					text: 'number',
					value: 'number',
				},
			];
			case 'string':
			case 'address': return [
				{
					text: type === 'address' ? 'id' : type,
					value: type === 'address' ? 'id' : type,
				},
				{
					text: 'hex',
					value: 'hex',
				},
			];
			default: {
				if (type.includes('int')) {
					return [
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

				return [
					{
						text: 'hex',
						value: 'hex',
					},
					{
						text: 'number',
						value: 'number',
					},
				];
			}
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
								defaultType={this.getDefaultType(constant.outputs[0].type)}
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
	match: PropTypes.object.isRequired,
	formatAbi: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

TabContractProps.defaultProps = {
	constants: null,
};

export default withRouter(connect(
	(state) => ({
		constants: state.contract.get('constants'),
	}),
	(dispatch) => ({
		formatAbi: (id) => dispatch(formatAbi(id)),
		clearForm: (value) => dispatch(clearForm(value)),
	}),
)(TabContractProps));
