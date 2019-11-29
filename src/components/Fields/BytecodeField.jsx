import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
import classnames from 'classnames';

class BytecodeField extends React.Component {

	onInput(e) {
		const value = e.target.value.toLowerCase().trim();

		this.props.setIn('bytecode', {
			error: null,
			value,
		});
	}

	render() {
		const {
			field,
		} = this.props;

		return (
			<Form.Field className={classnames('error-wrap', { error: field.error })}>

				<label htmlFor="bytecode">bytecode</label>
				<Input type="text" placeholder="Bytecode" className={classnames('action-wrap')}>
					<input name="bytecode" value={field.value} onInput={(e) => this.onInput(e)} />
					{ field.error ? <span className="icon-error-red value-status" /> : null }
				</Input>
				<span className="error-message">{field.error}</span>

			</Form.Field>
		);
	}

}

BytecodeField.propTypes = {
	field: PropTypes.any.isRequired,
	setIn: PropTypes.func.isRequired,
};

export default BytecodeField;
