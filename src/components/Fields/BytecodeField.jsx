import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ErrorMessage from '../ErrorMessage';

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
			optional,
		} = this.props;

		return (
			<div className={classnames('field error-wrap', { error: field.error })}>

				<label htmlFor="bytecode">
					bytecode
					{
						optional && <div className="label-info right">(optional)</div>
					}
				</label>
				<div type="text" placeholder="Bytecode" className={classnames('input action-wrap')}>
					<textarea
						name="bytecode"
						value={field.value}
						onInput={(e) => this.onInput(e)}
					/>
					{ field.error && <span className="icon-error value-status" /> }
				</div>
				<ErrorMessage
					show={!!field.error}
					value={field.error}
				/>

			</div>
		);
	}

}

BytecodeField.propTypes = {
	field: PropTypes.any.isRequired,
	setIn: PropTypes.func.isRequired,
	optional: PropTypes.bool,
};

BytecodeField.defaultProps = {
	optional: false,
};

export default BytecodeField;
