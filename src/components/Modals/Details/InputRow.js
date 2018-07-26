import React from 'react';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class InputRow extends React.Component {

	render() {
		const { label, data } = this.props;

		return (
			<Form.Field>
				<label htmlFor="amount">
					{label}
				</label>
				<div>
					<input type="text" placeholder="Fee" name="Fee" disabled className="ui input" value={data} />
				</div>
			</Form.Field>
		);
	}

}

InputRow.propTypes = {
	label: PropTypes.string.isRequired,
	data: PropTypes.string.isRequired,
};

export default connect((state, ownProps) => ({
	label: ownProps.label,
	data: ownProps.data,
}))(InputRow);
