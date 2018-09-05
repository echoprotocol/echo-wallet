import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';


class AddCustomNetwork extends React.Component {

	onChange(e) {
		const { name, value } = e.target;
		this.props.setFormValue(name, value);
	}

	renderField(name, { value, error }) {
		const { showCustom } = this.props;

		return (
			<Form.Field className={classnames('error-wrap', { error })}>
				<label htmlFor="address">{name}</label>
				<input
					className="ui input"
					placeholder={name}
					name={name}
					disabled={!showCustom}
					value={value}
					onChange={(e) => this.onChange(e)}
				/>
				<span className="error-message">{error}</span>
			</Form.Field>
		);
	}

	render() {
		const {
			showCustom, address, name, registrator,
		} = this.props;

		return (
			<React.Fragment>
				<div className={classnames('custom-network', { active: showCustom })}>
					{this.renderField('address', address)}
					{this.renderField('name', name)}
					{this.renderField('registrator', registrator)}
				</div>
				<div className="check">
					<input type="checkbox" id="addToNetworks" />
					<label className="label" htmlFor="addToNetworks">
						<span className="label-text">lkdjaklsdafsaf</span>
					</label>
				</div>
			</React.Fragment>
		);
	}

}

AddCustomNetwork.propTypes = {
	showCustom: PropTypes.bool.isRequired,
	address: PropTypes.object.isRequired,
	name: PropTypes.object.isRequired,
	registrator: PropTypes.object.isRequired,
	setFormValue: PropTypes.func.isRequired,
};

export default AddCustomNetwork;
