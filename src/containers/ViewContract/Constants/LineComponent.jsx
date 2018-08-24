import React from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import classnames from 'classnames';

import { contractQuery, set } from '../../../actions/ContractActions';

import { convertContractConstant } from '../../../helpers/FormatHelper';

import { FORM_VIEW_CONTRACT } from '../../../constants/FormConstants';

import InputComponent from './InputComponent';

class LineComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			valueType: undefined,
			showResult: false,
		};
	}

	componentWillMount() {
		const { constant } = this.props;

		if (constant.outputs[0].type === 'string') {
			this.setState({ valueType: 'string' });
		} else if (constant.outputs[0].type === 'bool') {
			this.setState({ valueType: 'bool' });
		} else {
			this.setState({ valueType: 'number' });
		}
	}

	onChange(e, data) {
		const { constant, constants } = this.props;

		const result = convertContractConstant(
			data.value,
			this.state.valueType,
			constant.constantValue,
		);

		if (result) {
			const newConstants = constants.toJS().map((item) => {
				if (item.name === constant.name) {
					item.constantValue = result.value;
				}
				return item;
			});

			this.props.set(newConstants);

			this.setState({ valueType: result.type });
		}

	}

	onQuery() {
		const {
			constant, contractId, inputs,
		} = this.props;

		const args = Object.keys(constant.inputs)
			.map((input) => inputs.toJS()[constant.name][input].value);

		this.props.contractQuery(constant, args, contractId);

		this.setState({ showResult: true });

	}

	renderConstant() {
		const { constant } = this.props;

		return (
			<span className="value item">
				{constant.constantValue}
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
				<Button className="item" size="mini" content="call" onClick={() => this.onQuery()} />
			</React.Fragment>
		);

	}

	render() {
		const { constant, typeOptions } = this.props;

		return (
			<div className="watchlist-line">
				<div className="watchlist-row">
					<span className="row-title"> {constant.name} </span>
				</div>
				<div className="watchlist-row">
					<div className="watchlist-col">
						<span className="icon-dotted" />
					</div>
					<div className="watchlist-col">
						<Dropdown
							placeholder={this.state.valueType}
							compact
							selection
							className="item contract-type-dropdown air"
							options={typeOptions}
							onChange={(e, data) => this.onChange(e, data)}
						/>
						{
							constant.inputs.length
								? this.renderInput()
								: this.renderConstant()
						}
					</div>
				</div>
				{
					this.state.showResult &&
					<div className="watchlist-row">
						<span className="result-value">
							{constant.constantValue}
						</span>
					</div>
				}
			</div>
		);
	}

}

LineComponent.propTypes = {
	constants: PropTypes.any,
	typeOptions: PropTypes.array.isRequired,
	constant: PropTypes.object.isRequired,
	inputs: PropTypes.object.isRequired,
	contractId: PropTypes.string.isRequired,
	contractQuery: PropTypes.func.isRequired,
	set: PropTypes.func.isRequired,
};

LineComponent.defaultProps = {
	constants: null,
};

export default connect(
	(state) => ({
		constants: state.contract.get('constants'),
		contractId: state.contract.get('id'),
		inputs: state.form.getIn([FORM_VIEW_CONTRACT, 'inputs']),
	}),
	(dispatch) => ({
		contractQuery: (method, args, contractId) => dispatch(contractQuery(method, args, contractId)),
		set: (value) => dispatch(set('constants', new List(value))),
	}),
)(LineComponent);
