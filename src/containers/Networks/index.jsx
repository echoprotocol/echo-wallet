import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Button } from 'semantic-ui-react';

import { FORM_ADD_CUSTOM_NETWORK } from '../../constants/FormConstants';

import { setFormValue, clearForm } from '../../actions/FormActions';
import { addNetwork } from '../../actions/GlobalActions';

import AddCustomNetwork from './AddCustomNetwork';

class Networks extends React.Component {

	componentWillUnmount() {
		this.props.clearForm();
	}

	onAddNetwork(e) {
		e.preventDefault();

		this.props.addNetwork();
	}

	onToggleSwitch() {
		// e.preventDefault();

		const { autoswitch } = this.props;

		this.props.setFormValue('autoswitch', !autoswitch.value);
	}

	goBack() {
		this.props.history.goBack();
	}

	render() {
		const {
			address, name, autoswitch,
		} = this.props;


		const isFormValid = (address.value && name.value) && (!address.error && !name.error);

		return (
			<div className="sign-scroll">
				<Form className="main-form">
					<div className="form-info">
						<button className="back-link" onClick={() => this.goBack()}>
							<span className="icon-back" />
							back
						</button>
						<h3>Add connection</h3>
					</div>
					<div className="field-wrap">
						<AddCustomNetwork
							address={address}
							name={name}
							setFormValue={this.props.setFormValue}
						/>
					</div>
					<div className="form-panel">
						<div className="check" style={{ marginRight: '75px' }}>
							<input
								type="checkbox"
								id="addToNetworks"
								checked={autoswitch.value}
								onChange={(e) => this.onToggleSwitch(e)}
							/>
							<label className="label" htmlFor="addToNetworks">
								<span className="label-text">Switch to this Network upon creating</span>
							</label>
						</div>
						<Button
							basic
							type="submit"
							className="main-btn"
							content="Create"
							onClick={(e) => this.onAddNetwork(e)}
							disabled={!isFormValid}
						/>
					</div>
				</Form>
			</div>
		);
	}

}

Networks.propTypes = {
	history: PropTypes.object.isRequired,
	address: PropTypes.object.isRequired,
	name: PropTypes.object.isRequired,
	autoswitch: PropTypes.object.isRequired,
	addNetwork: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		address: state.form.getIn([FORM_ADD_CUSTOM_NETWORK, 'address']),
		name: state.form.getIn([FORM_ADD_CUSTOM_NETWORK, 'name']),
		autoswitch: state.form.getIn([FORM_ADD_CUSTOM_NETWORK, 'autoswitch']),
	}),
	(dispatch) => ({
		addNetwork: () => dispatch(addNetwork()),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_ADD_CUSTOM_NETWORK, field, value)),
		clearForm: () => dispatch(clearForm(FORM_ADD_CUSTOM_NETWORK)),
	}),
)(Networks));
