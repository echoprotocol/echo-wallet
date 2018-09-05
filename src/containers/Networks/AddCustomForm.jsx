import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import classnames from 'classnames';

class Networks extends React.Component {

	render() {
		const { showCustom } = this.props;

		return (
			<div className={classnames('custom-network', { active: showCustom })}>
				<Form.Field className={classnames('error-wrap')}>
					<label htmlFor="address">Address</label>
					<input placeholder="Address" disabled={!showCustom} name="address" className="ui input" />
					<span className="error-message">asdasd</span>
				</Form.Field>
				<Form.Field className={classnames('error-wrap')}>
					<label htmlFor="name">Name</label>
					<input placeholder="Name" disabled={!showCustom} name="name" className="ui input" />
					<span className="error-message">asdasd</span>
				</Form.Field>
				<Form.Field className={classnames('error-wrap')}>
					<label htmlFor="registrator">Registrator</label>
					<input placeholder="Registrator" disabled={!showCustom} name="registrator" className="ui input" />
					<span className="error-message">Registrator error</span>
				</Form.Field>
			</div>
		);
	}

}

Networks.propTypes = {
	showCustom: PropTypes.bool.isRequired,
};

export default connect(
	() => ({}),
	() => ({}),
)(Networks);
