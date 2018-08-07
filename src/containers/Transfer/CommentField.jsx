import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';

import { FORM_TRANSFER } from '../../constants/FormConstants';
import { setFormValue } from '../../actions/FormActions';

class CommentField extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			comment: '',
			timeout: null,
		};
	}

	onComment(e) {
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}

		const comment = e.target.value;

		this.setState({
			comment,
			timeout: setTimeout(() => {
				this.props.setFormValue('comment', comment);
			}, 300),
		});
	}

	render() {
		const { comment } = this.state;
		const { currency } = this.props;

		return (
			<Form.Field>
				<Form.Field
					label="Comment"
					className="comment"
					placeholder="Comment"
					control="textarea"
					value={comment}
					onChange={(e) => this.onComment(e)}
					disabled={currency ? currency.type === 'tokens' : false}
				/>
			</Form.Field>
		);
	}

}

CommentField.propTypes = {
	currency: PropTypes.object,
	setFormValue: PropTypes.func.isRequired,
};

CommentField.defaultProps = {
	currency: null,
};

export default connect(
	(state) => ({
		currency: state.form.getIn([FORM_TRANSFER, 'currency']),
	}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_TRANSFER, field, value)),
	}),
)(CommentField);
