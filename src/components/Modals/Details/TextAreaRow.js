import React from 'react';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class TextAreaRow extends React.Component {

	render() {
		const { label, data } = this.props;

		return (
			<Form.Field className="comment" label={label} placeholder="Data" disabled control="textarea" value={data} />
		);
	}

}

TextAreaRow.propTypes = {
	label: PropTypes.string.isRequired,
	data: PropTypes.string.isRequired,
};

export default connect((state, ownProps) => ({
	label: ownProps.label,
	data: ownProps.data,
}))(TextAreaRow);
