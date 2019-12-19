import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';

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
		const { form } = this.props;

		const bytecode = form.get('bytecode');
		const name = form.get('name');
		const abi = form.get('abi');

		return (
			<React.Fragment>
				<div className={classnames('field error-wrap', { error: !!bytecode.error })}>
					<label htmlFor="bytecode">Bytecode</label>
					<textarea
						type="text"
						placeholder="Bytecode"
						name="bytecode"
						className="input"
						value={bytecode.value}
						onChange={(e) => this.onChange(e)}
						autoFocus
					/>
					<ErrorMessage
						show={!!bytecode.error}
						value={bytecode.error}
					/>
				</div>
				<div className={classnames('field error-wrap', { error: !!abi.error })}>
					<label htmlFor="bytecode">
						ABI
						<span className="label-info">(If you insert ABI, contract will add to watchlist)</span>
						<span className="label-info right">(optional)</span>
					</label>
					<textarea
						type="text"
						placeholder="ABI"
						name="abi"
						className="input"
						value={abi.value}
						onChange={(e) => this.onChange(e, true)}
					/>
					<ErrorMessage
						show={!!abi.error}
						value={abi.error}
					/>
				</div>
				<div className={classnames('field error-wrap', { error: !!name.error })}>
					<div className="action-wrap">
						<Form.Field
							label="Contract Name"
							placeholder="Contract Name"
							control="input"
							name="name"
							value={name.value}
							onChange={(e) => this.onChange(e, true)}
						/>
					</div>
					<ErrorMessage
						show={!!name.error}
						value={name.error}
					/>
				</div>
			</React.Fragment>
		);
	}

}

Bytecode.propTypes = {
	form: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
	setDefaultAsset: PropTypes.func.isRequired,
};

export default Bytecode;
