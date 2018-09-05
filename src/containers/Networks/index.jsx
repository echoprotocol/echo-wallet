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

	onToggleSwitch(e) {
		e.preventDefault();

		const { autoswitch } = this.props;

		this.props.setFormValue('autoswitch', !autoswitch.value);
	}

	render() {
		const {
			history, address, name, registrator, autoswitch,
		} = this.props;


		const isFormValid = (address.value && name.value && registrator.value) &&
			(!address.error && !name.error && !registrator.error);

		return (
			<div className="sign-scroll-fix">
				<Form className="main-form">
					<div className="form-info">
						<a
							href="#"
							onClick={history.goBack}
							className="back-link"
						>
							<span className="icon-back" />
                        back
						</a>
						<h3>Create new Network</h3>
					</div>
					<div className="field-wrap">
						<AddCustomNetwork
							address={address}
							name={name}
							registrator={registrator}
							setFormValue={this.props.setFormValue}
						/>
					</div>
					<div className="form-panel">
						<div className="check">
							<input
								type="checkbox"
								id="addToNetworks"
								checked={autoswitch.value}
								onInput={(e) => this.onToggleSwitch(e)}
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
	registrator: PropTypes.object.isRequired,
	autoswitch: PropTypes.object.isRequired,
	addNetwork: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		address: state.form.getIn([FORM_ADD_CUSTOM_NETWORK, 'address']),
		name: state.form.getIn([FORM_ADD_CUSTOM_NETWORK, 'name']),
		registrator: state.form.getIn([FORM_ADD_CUSTOM_NETWORK, 'registrator']),
		autoswitch: state.form.getIn([FORM_ADD_CUSTOM_NETWORK, 'autoswitch']),
	}),
	(dispatch) => ({
		addNetwork: () => dispatch(addNetwork()),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_ADD_CUSTOM_NETWORK, field, value)),
		clearForm: () => dispatch(clearForm(FORM_ADD_CUSTOM_NETWORK)),
	}),
)(Networks));
