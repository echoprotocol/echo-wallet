import React from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SingleInput from './SingleInput';
import { FORM_VIEW_CONTRACT } from '../../../constants/FormConstants';
import { contractQuery } from '../../../actions/ContractActions';

class InputLine extends React.Component {

	constructor() {
		super();
		this.state = { showResult: false };
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
							placeholder="Empty"
							compact
							selection
							className="item contract-type-dropdown air"
							options={typeOptions}
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
