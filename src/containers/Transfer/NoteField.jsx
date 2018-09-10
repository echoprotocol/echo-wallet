import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, TextArea } from 'semantic-ui-react';
import classnames from 'classnames';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import { setFormValue } from '../../actions/FormActions';

class NoteField extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			note: '',
			timeout: null,
		};
	}

	onNote(e) {
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}

		const note = e.target.value;

		this.setState({
			note,
			timeout: setTimeout(() => {
				this.props.setFormValue('note', note);
			}, 300),
		});
	}

	render() {
		const { note } = this.state;
		const { currency, error } = this.props;

		return (
			<Form.Field className={classnames('error-wrap', { error })}>
				<label htmlFor="note">Note</label>
				<TextArea
					className="comment"
					name="note"
					placeholder="Note"
					value={currency && currency.type === 'tokens' ? '' : note}
					onChange={(e) => this.onNote(e)}
					disabled={currency ? currency.type === 'tokens' : false}
				/>
				<span className="error-message">{error}</span>
			</Form.Field>
		);
	}

}

NoteField.propTypes = {
	currency: PropTypes.object,
	error: PropTypes.any,
	setFormValue: PropTypes.func.isRequired,
};

NoteField.defaultProps = {
	currency: null,
	error: null,
};

export default connect(
	(state) => ({
		error: state.form.getIn([FORM_TRANSFER, 'note']).error,
		currency: state.form.getIn([FORM_TRANSFER, 'currency']),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_TRANSFER, field, value)),
	}),
)(NoteField);
