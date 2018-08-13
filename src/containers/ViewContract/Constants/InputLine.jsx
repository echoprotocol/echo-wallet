import React from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SingleInput from './SingleInput';

import { contractQuery } from '../../../actions/ContractActions';

import { FORM_VIEW_CONTRACT } from '../../../constants/FormConstants';
import { convertContractConstant } from '../../../helpers/FormatHelper';

class InputLine extends React.Component {

	constructor() {
		super();
		this.state = {
			showResult: false,
			valueType: undefined,
			constantValue: undefined,
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
		this.setState({ constantValue: constant.constantValue });
	}

	onChange(e, data) {
		const { constantValue } = this.state;
		const result = convertContractConstant(data.value, this.state.valueType, constantValue);
		if (result) {
			this.setState({
				constantValue: result.value,
				valueType: result.type,
			});
		}
	}

	onQuery() {
		const { inputField, constant, contractId } = this.props;
		const args = Object.keys(constant.inputs).map((input) => inputField.toJS()[`${constant.name},${input}`].value);
		this.props.contractQuery(constant, args, contractId);
		this.setState({ showResult: true });
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
							constant.inputs.map((input, index) => {
								const id = index;
								if (id !== 0) {
									return (
										<div key={id} >
											<span className="comma item">,</span>
											<SingleInput field={{ id, name: constant.name }} inputData={input} />
										</div>
									);
								}
								return (
									<SingleInput key={id} field={{ id, name: constant.name }} inputData={input} />
								);
							})
						}
						<Button className="item" size="mini" content="call" onClick={() => this.onQuery()} />
					</div>
				</div>
				{
					this.state.showResult &&
						<div className="watchlist-row">
							<div className="watchlist-col" />
							<div className="watchlist-col">
								<span>
									{constant.constantValue}
								</span>
							</div>
						</div>
				}
			</div>
		);
	}

}

InputLine.propTypes = {
	typeOptions: PropTypes.array.isRequired,
	constant: PropTypes.object.isRequired,
	inputField: PropTypes.object,
	contractId: PropTypes.string.isRequired,
	contractQuery: PropTypes.func.isRequired,
};

InputLine.defaultProps = {
	inputField: null,
};
export default connect(
	(state) => ({
		inputField: state.form.getIn([FORM_VIEW_CONTRACT]),
		contractId: state.contract.get('id'),
	}),
	(dispatch) => ({
		contractQuery: (method, args, contractId) => dispatch(contractQuery(method, args, contractId)),
	}),
)(InputLine);
