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

		return (
			<Form.Field>
				<Form.Field
					label="Comment"
					className="comment"
					placeholder="Comment"
					control="textarea"
					value={comment}
					onChange={(e) => this.onComment(e)}
				/>
			</Form.Field>
		);
	}

}

CommentField.propTypes = {
	setFormValue: PropTypes.func.isRequired,
};

export default connect(
	() => ({}),
	(dispatch) => ({
		setFormValue: (field, value) => dispatch(setFormValue(FORM_TRANSFER, field, value)),
	}),
)(CommentField);
