import React from 'react';
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { contractQuery } from '../../../actions/ContractActions';

import { formatCallContractField } from '../../../helpers/FormatHelper';

import { FORM_VIEW_CONTRACT } from '../../../constants/FormConstants';

import InputComponent from './InputComponent';
import Dropdown from '../../../components/Dropdown';

class LineComponent extends React.Component {

	onQuery() {
		const {
			constant, contractId, inputs,
		} = this.props;

		const args = Object.keys(constant.inputs)
			.map((input) => inputs.toJS()[constant.name][input].value);

		this.props.contractQuery(constant, args, contractId);

	}

	renderConstant() {
		const { constant, convertedConstants } = this.props;

		const convertedConstant = convertedConstants.find((val) => constant.name === val.name);

		return (
			<span className="value item">
				{convertedConstant ? convertedConstant.value : `0x${constant.constantValue}`}
			</span>
		);
	}

	renderInput() {
		const { constant, inputs } = this.props;

		return (
			<React.Fragment>
				{
					constant.inputs.map((input, index) => {
						const id = index;
						const errorValue = inputs.toJS()[constant.name][index].error;
						return (
							<Form.Field key={id} className={classnames({ error: errorValue, 'error-wrap': true })}>
								{ id !== 0 && <span className="comma item">,</span> }
								<InputComponent field={{ id, name: constant.name }} inputData={input} />
								<span className="error-message">{errorValue}</span>
							</Form.Field>
						);
					})
				}
				<Button
					basic
					className="item main-btn"
					size="mini"
					content="call"
					onClick={() => this.onQuery()}
				/>
			</React.Fragment>
		);

	}

	renderQueryResult() {
		const { constant, convertedConstants } = this.props;

		const convertedConstant = convertedConstants.find((val) => constant.name === val.name);

		return (
			<React.Fragment>
				{
					constant.showQueryResult &&
					<div className="watchlist-row">
						<div className="result-value">
							{convertedConstant ? convertedConstant.value : `0x${constant.constantValue}`}
						</div>
					</div>
				}
			</React.Fragment>
		);
	}

	render() {
		const { constant, typeOptions, convertedConstants } = this.props;
		const convertedConstant = convertedConstants.find((val) => constant.name === val.name);

		return (
			<div className="watchlist-line">
				<div className="watchlist-row">
					<span className="row-title"> {formatCallContractField(constant.name)} </span>
				</div>
				<div className="watchlist-row">
					<div className="watchlist-col">
						<span className="icon-dotted" />
					</div>
					<div className="watchlist-col">
						<Dropdown
							data={constant.constantValue}
							variativeOptions={typeOptions}
							component={constant}
							activeType={convertedConstant ? convertedConstant.type : null}
						/>
						{
							constant.inputs.length
								? this.renderInput()
								: this.renderConstant()
						}
					</div>
				</div>
				{this.renderQueryResult()}
			</div>
		);
	}

}

LineComponent.propTypes = {
	convertedConstants: PropTypes.array.isRequired,
	typeOptions: PropTypes.array.isRequired,
	constant: PropTypes.object.isRequired,
	inputs: PropTypes.object.isRequired,
	contractId: PropTypes.string.isRequired,
	contractQuery: PropTypes.func.isRequired,
};

export default connect(
	(state) => ({
		convertedConstants: state.converter.get('convertedConstants').toJS(),
		contractId: state.contract.get('id'),
		inputs: state.form.getIn([FORM_VIEW_CONTRACT, 'inputs']),
	}),
	(dispatch) => ({
		contractQuery: (method, args, contractId) => dispatch(contractQuery(method, args, contractId)),
	}),
)(LineComponent);
