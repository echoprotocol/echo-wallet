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
					className={classnames('amount-wrap action-wrap')}
				>
					<div
						className={classnames(
							'amount-wrap',
							'action-wrap',
						)}
					>
						<input
							className="address"
							placeholder="Address"
							value={address ? address.address : ''}
							name="address"
							onChange={() => {}}
							onFocus={() => {}}
							onBlur={() => {}}
						/>
					</div>
				</Input>

			</Form.Field>
		);
	}

}

AddressField.propTypes = {
	labelText: PropTypes.string,
	address: PropTypes.object,
};


AddressField.defaultProps = {
	labelText: 'Address',
	address: null,
};

export default AddressField;
