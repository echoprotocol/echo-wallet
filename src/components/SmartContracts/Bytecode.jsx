import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';

class Bytecode extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.props.setDefaultAsset();
	}

	onChange(e) {
		const field = e.target.name;
		const { value } = e.target;
		if (field) {
			this.props.setFormValue(field, value);
		}
	}

	render() {
		const { form } = this.props;

		const bytecode = form.get('bytecode');
		const name = form.get('name');
		const abi = form.get('abi');

		return (
			<React.Fragment>
				<Form.Field className={classnames('error-wrap', { error: !!bytecode.error })}>
					<label htmlFor="bytecode">Bytecode</label>
					<textarea
						type="text"
						placeholder="Bytecode"
						name="bytecode"
						className="input"
						onChange={(e) => this.onChange(e)}
						autoFocus
					/>
					{ bytecode.error && <span className="error-message">{bytecode.error}</span> }
				</Form.Field>
				<Form.Field className={classnames('error-wrap', { error: !!abi.error })}>
					<label htmlFor="bytecode">
						ABI
						<span className="label-info">(If you insert ABI, contract will add to watchlist)</span>
						<span className="label-info">Optional</span>
					</label>
					<textarea
						type="text"
						placeholder="ABI"
						name="abi"
						className="input"
						value={abi.value}
						onChange={(e) => this.onChange(e, true)}
					/>
					{ abi.error && <span className="error-message">{abi.error}</span> }
				</Form.Field>
				<div className={classnames('error-wrap', { error: !!name.error })}>
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
					{ name.error && <span className="error-message">{name.error}</span> }
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

Bytecode.defaultProps = {};


export default Bytecode;
