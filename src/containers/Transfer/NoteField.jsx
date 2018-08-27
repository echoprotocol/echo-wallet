import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';

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
		const { currency } = this.props;

		return (
			<Form.Field>
				<Form.Field
					label="Note"
					className="comment"
					placeholder="Note"
					control="textarea"
					value={currency && currency.type === 'tokens' ? '' : note}
					onChange={(e) => this.onNote(e)}
					disabled={currency ? currency.type === 'tokens' : false}
				/>
			</Form.Field>
		);
	}

}

NoteField.propTypes = {
	currency: PropTypes.object,
	setFormValue: PropTypes.func.isRequired,
};

NoteField.defaultProps = {
	currency: null,
};

export default connect(
	(state) => ({
		currency: state.form.getIn([FORM_TRANSFER, 'currency']),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_TRANSFER, field, value)),
	}),
)(NoteField);
