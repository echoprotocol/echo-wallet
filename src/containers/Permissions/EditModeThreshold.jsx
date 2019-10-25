import React from 'react';
import { Form, Popup } from 'semantic-ui-react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class EditModeThreshold extends React.Component {

	render() {
		const { threshold } = this.props;

		return (
			<Form className="edit-threshold">
				<Form.Field className={classnames({ error: false })}>
					<Popup
						trigger={<span className="inner-tooltip-trigger icon-info" />}
						content="You can split authority to sign a transaction by setting threshold. Total weight of all the keys in the wallet must be equal or more than threshold to sign a transaction."
						className="inner-tooltip"
						position="bottom center"
						style={{ width: 420 }}
					/>
					<span className="threshold">threshold: </span>
					<input
						type="text"
						name="threshold"
						className="input"
						value={threshold.value}
					/>
					{ threshold.error && <span className="error-message">{threshold.error}</span>}
				</Form.Field>
			</Form>
		);
	}

}

EditModeThreshold.propTypes = {
	threshold: PropTypes.object,
};

EditModeThreshold.defaultProps = {
	threshold: {},
};

export default EditModeThreshold;
