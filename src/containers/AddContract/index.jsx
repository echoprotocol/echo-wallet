import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import { FORM_ADD_CONTRACT } from '../../constants/FormConstants';

import { setFormValue, clearForm } from '../../actions/FormActions';
import { addContract } from '../../actions/ContractActions';
import { version } from '../../../package.json';
import { contractIdRegex } from '../../helpers/ValidateHelper';
import ErrorMessage from '../../components/ErrorMessage';


class AddContractComponent extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
	}

	onInput(e) {
		if (e.target.name === 'id' && e.target.value.match(contractIdRegex)) {
			this.props.setFormValue(e.target.name, e.target.value);
		} else if (e.target.name === 'name' || e.target.name === 'abi') {
			this.props.setFormValue(e.target.name, e.target.value);
		}
	}

	onClick() {
		const { name, id, abi } = this.props;

		if (name.error || id.error || abi.error) {
			return;
		}

		this.props.addContract(name.value.trim(), id.value.trim(), abi.value.trim());
	}

	render() {
		const {
			name, id, abi, intl,
		} = this.props;

		const namePlaceholder = intl.formatMessage({ id: 'smart_contract_page.watch_contract_page.input_name.placeholder' });
		const IDPlaceholder = intl.formatMessage({ id: 'smart_contract_page.watch_contract_page.input_id.placeholder' });
		const ABIPlaceholder = intl.formatMessage({ id: 'smart_contract_page.watch_contract_page.input_abi.placeholder' });
		return (
			<Form className="main-form">
				<div className="form-info">
					<h3>
						<FormattedMessage id="smart_contract_page.watch_contract_page.title" />
					</h3>
				</div>
				<div className="field-wrap">
					<div className={classnames('field', { error: name.error })}>
						<label htmlFor="name">
							<FormattedMessage id="smart_contract_page.watch_contract_page.input_name.title" />
						</label>
						<input
							type="text"
							placeholder={namePlaceholder}
							name="name"
							value={name.value}
							onChange={(e) => this.onInput(e)}
							autoFocus
						/>
						<ErrorMessage
							value={name.error}
							intl={intl}
						/>
					</div>
					<div className={classnames('field', { error: id.error })}>
						<label htmlFor="id">
							<FormattedMessage id="smart_contract_page.watch_contract_page.input_id.title" />
						</label>
						<input
							type="text"
							placeholder={IDPlaceholder}
							name="id"
							value={id.value}
							onChange={(e) => this.onInput(e)}
						/>
						<ErrorMessage
							value={id.error}
							intl={intl}
						/>
					</div>
					<div className={classnames('field', { error: abi.error })}>
						<label htmlFor="abi">
							<FormattedMessage id="smart_contract_page.watch_contract_page.input_abi.title" />
						</label>
						<textarea
							type="text"
							placeholder={ABIPlaceholder}
							name="abi"
							value={abi.value}
							onChange={(e) => this.onInput(e)}
						/>
						<ErrorMessage
							value={abi.error}
							intl={intl}
						/>
					</div>
					<div className="form-panel">
						<Button
							basic
							type="button"
							className="main-btn"
							content={
								<FormattedMessage id="smart_contract_page.watch_contract_page.button_text" />
							}
							onClick={(e) => this.onClick(e)}
						/>
					</div>
				</div>
			</Form>
		);
	}

}

AddContractComponent.propTypes = {
	name: PropTypes.object.isRequired,
	id: PropTypes.object.isRequired,
	abi: PropTypes.object.isRequired,
	clearForm: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	addContract: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
};


export default injectIntl(connect(
	(state) => ({
		name: state.form.getIn([FORM_ADD_CONTRACT, 'name']),
		id: state.form.getIn([FORM_ADD_CONTRACT, 'id']),
		abi: state.form.getIn([FORM_ADD_CONTRACT, 'abi']),
		version,
	}),
	(dispatch) => ({
		clearForm: () => dispatch(clearForm(FORM_ADD_CONTRACT)),
		setFormValue: (param, value) => dispatch(setFormValue(FORM_ADD_CONTRACT, param, value)),
		addContract: (name, id, abi) => dispatch(addContract(name, id, abi)),
	}),
)(AddContractComponent));
