import React from 'react';
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import { contractQuery } from '../../../actions/ContractActions';

import { formatCallContractField } from '../../../helpers/FormatHelper';

import { FORM_VIEW_CONTRACT } from '../../../constants/FormConstants';

import InputComponent from './InputComponent';
import ErrorMessage from '../../../components/ErrorMessage';
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

	onKeyDown(e) {
		if (e.keyCode === 13) {
			this.onQuery();
		}
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
		const { constant, inputs, intl } = this.props;

		return (
			<React.Fragment>
				{
					constant.inputs.map((input, index) => {
						const id = index;
						const errorValue = inputs.toJS()[constant.name] &&
							inputs.toJS()[constant.name][index] &&
							inputs.toJS()[constant.name][index].error;
						return (
							<Form.Field key={id} className={classnames({ error: errorValue, 'error-wrap': true })}>
								{ id !== 0 && <span className="comma item">,</span> }
								<InputComponent
									field={{ id, name: constant.name }}
									inputData={input}
									onKeyDown={(e) => this.onKeyDown(e)}
								/>
								<ErrorMessage
									value={errorValue}
									intl={intl}
								/>

							</Form.Field>
						);
					})
				}
				<Button
					basic
					className="item main-btn"
					size="mini"
					content={
						<FormattedMessage id="smart_contract_page.contract_info.view_properties_tab.call_btn" />
					}
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
							(convertedConstant ? convertedConstant.value : `0x${constant.constantValue}`)
				}
			</React.Fragment>
		);

	}

	renderDropdown() {
		const {
			constant, typeOptions, convertedConstants, defaultType,
		} = this.props;

		const convertedConstant = convertedConstants.find((val) => constant.name === val.name);

		return (
			<Dropdown
				defaultType={defaultType}
				data={constant.constantValue}
				variativeOptions={typeOptions}
				component={constant}
				activeType={convertedConstant ? convertedConstant.type : null}
			/>
		);
	}

	render() {
		const { constant } = this.props;

		return (
			<div className="watchlist-line">
				<div className="watchlist-row">
					<span className="row-title"> {formatCallContractField(constant.name)} </span>
				</div>
				{
					constant.inputs.length ? (
						<React.Fragment>
							<div className="watchlist-row">
								<div className="watchlist-col">
									<span className="icon-dotted" />
								</div>
								<div className="watchlist-col">
									{
										this.renderInput()
									}
								</div>
							</div>
							{
								constant.showQueryResult && (
									<div className="watchlist-row inner">
										<div className="watchlist-col">
											{
												this.renderDropdown()
											}
										</div>
										<div className="watchlist-col">
											{
												this.renderQueryResult()
											}
										</div>
									</div>
								)
							}
						</React.Fragment>
					) : (
						<React.Fragment>
							<div className="watchlist-row">
								<div className="watchlist-col">
									<span className="icon-dotted" />
								</div>
								<div className="watchlist-col">
									{
										this.renderDropdown()
									}
									{
										this.renderConstant()
									}
								</div>
							</div>
							{
								constant.showQueryResult && (
									<div className="watchlist-row">
										<div className="watchlist-col">
											{
												this.renderQueryResult()
											}
										</div>
									</div>
								)
							}
						</React.Fragment>
					)
				}
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
	defaultType: PropTypes.string.isRequired,
	intl: PropTypes.any.isRequired,
};

export default injectIntl(connect(
	(state) => ({
		convertedConstants: state.converter.get('convertedConstants').toJS(),
		contractId: state.contract.get('id'),
		inputs: state.form.getIn([FORM_VIEW_CONTRACT, 'inputs']),
	}),
	(dispatch) => ({
		contractQuery: (method, args, contractId) => dispatch(contractQuery(method, args, contractId)),
	}),
)(LineComponent));
