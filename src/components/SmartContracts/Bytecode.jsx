import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import { FORM_CREATE_CONTRACT_BYTECODE } from '../../constants/FormConstants';
import ErrorMessage from '../ErrorMessage';

class Bytecode extends React.Component {

	componentDidMount() {
		this.props.setDefaultAsset(FORM_CREATE_CONTRACT_BYTECODE);
	}

	onChange(e) {
		const field = e.target.name;
		const { value } = e.target;
		if (field) {
			this.props.setFormValue(FORM_CREATE_CONTRACT_BYTECODE, field, value);
		}
	}

	render() {
		const { form, intl } = this.props;

		const bytecode = form.get('bytecode');
		const name = form.get('name');
		const abi = form.get('abi');
		const bytecodePlaceholder = intl.formatMessage({ id: 'smart_contract_page.create_contract_page.bytecode.input_bytecode.placeholder' });
		const ABIPlaceholder = intl.formatMessage({ id: 'smart_contract_page.create_contract_page.bytecode.input_abi.placeholder' });
		const namePlaceholder = intl.formatMessage({ id: 'smart_contract_page.create_contract_page.bytecode.input_name.placeholder' });

		return (
			<React.Fragment>
<<<<<<< HEAD
				<div className={classnames('field error-wrap', { error: !!bytecode.error })}>
					<label htmlFor="bytecode">Bytecode</label>
=======
				<Form.Field className={classnames('error-wrap', { error: !!bytecode.error })}>
					<label htmlFor="bytecode">
						<FormattedMessage id="smart_contract_page.create_contract_page.bytecode.input_bytecode.title" />
					</label>
>>>>>>> 6dc49ee730c0c6d5b3138917d3d8597d3b3fa34f
					<textarea
						type="text"
						placeholder={bytecodePlaceholder}
						name="bytecode"
						className="input"
						value={bytecode.value}
						onChange={(e) => this.onChange(e)}
						autoFocus
					/>
<<<<<<< HEAD
					<ErrorMessage
						show={!!bytecode.error}
						value={bytecode.error}
					/>
				</div>
				<div className={classnames('field error-wrap', { error: !!abi.error })}>
=======
					{ bytecode.error &&
					<span className="error-message">{intl.formatMessage({ id: bytecode.error })}</span> }
				</Form.Field>
				<Form.Field className={classnames('error-wrap', { error: !!abi.error })}>
>>>>>>> 6dc49ee730c0c6d5b3138917d3d8597d3b3fa34f
					<label htmlFor="bytecode">
						<FormattedMessage id="smart_contract_page.create_contract_page.bytecode.input_abi.title_pt1" />
						<span className="label-info">
							<FormattedMessage id="smart_contract_page.create_contract_page.bytecode.input_abi.title_pt2" />
						</span>
						<span className="label-info right">
							<FormattedMessage id="smart_contract_page.create_contract_page.bytecode.input_abi.title_pt3" />
						</span>
					</label>
					<textarea
						type="text"
						placeholder={ABIPlaceholder}
						name="abi"
						className="input"
						value={abi.value}
						onChange={(e) => this.onChange(e, true)}
					/>
<<<<<<< HEAD
					<ErrorMessage
						show={!!abi.error}
						value={abi.error}
					/>
				</div>
				<div className={classnames('field error-wrap', { error: !!name.error })}>
=======
					{ abi.error &&
					<span className="error-message">{intl.formatMessage({ id: abi.error })}</span> }
				</Form.Field>
				<div className={classnames('error-wrap', { error: !!name.error })}>
>>>>>>> 6dc49ee730c0c6d5b3138917d3d8597d3b3fa34f
					<div className="action-wrap">
						<Form.Field
							label="Contract Name"
							placeholder={namePlaceholder}
							control="input"
							name="name"
							value={name.value}
							onChange={(e) => this.onChange(e, true)}
						/>
					</div>
<<<<<<< HEAD
					<ErrorMessage
						show={!!name.error}
						value={name.error}
					/>
=======
					{ name.error &&
					<span className="error-message">{intl.formatMessage({ id: name.error })}</span> }
>>>>>>> 6dc49ee730c0c6d5b3138917d3d8597d3b3fa34f
				</div>
			</React.Fragment>
		);
	}

}

Bytecode.propTypes = {
	form: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
	intl: PropTypes.any.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
};

export default injectIntl(Bytecode);
