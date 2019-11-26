/* eslint-disable linebreak-style */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
import classnames from 'classnames';

class AddressField extends React.Component {

	render() {
		const {
			address, labelText,
		} = this.props;

		return (
			<Form.Field>
				<label htmlFor="amount">
					{labelText}
				</label>
				<Input
					type="text"
					placeholder="Address"
					tabIndex="0"
					action
					className={classnames('action-wrap')}
				>
					<input
						placeholder="Address"
						value={address}
						name="address"
						onChange={() => {}}
						onFocus={() => {}}
						onBlur={() => {}}
						readOnly
					/>
				</Input>

			</Form.Field>
		);
	}

}

AddressField.propTypes = {
	labelText: PropTypes.string,
	address: PropTypes.string,
};


AddressField.defaultProps = {
	labelText: 'Address',
	address: '',
};

export default AddressField;
