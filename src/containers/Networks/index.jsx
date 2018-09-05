import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Button } from 'semantic-ui-react';

import { NETWORKS } from '../../constants/GlobalConstants';
import { FORM_ADD_CUSTOM_NETWORK } from '../../constants/FormConstants';

import { setFormValue, clearForm } from '../../actions/FormActions';
import { saveNetwork, addNetwork, deleteNetwork } from '../../actions/GlobalActions';

import AddCustomNetwork from './AddCustomNetwork';

class Networks extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			network: props.network,
			showCustom: false,
		};
	}

	componentWillUnmount() {
		this.props.clearForm();
	}

	onChangeNetwork(network) {
		this.setState({ network, showCustom: false });
	}

	onSaveNetwork(e) {
		e.preventDefault();

		const { network } = this.state;

		if (network.name === this.props.network.name || network.name === 'custom') {
			return;
		}

		this.props.saveNetwork(network);
	}

	onAddNetwork(e) {
		e.preventDefault();

		const { address, name, registrator } = this.props;

		this.props.addNetwork(address, name, registrator);
	}

	onDeleteNetwork(network) {
		this.props.deleteNetwork(network);
	}

	onShowCustom() {
		this.setState({ network: { name: 'custom' }, showCustom: true });
	}

	renderNetworks() {
		const { networks } = this.props;
		const { name } = this.state.network;

		return networks.map((i) => (
			<div className="radio" key={i.name} >
				<input
					type="radio"
					id={i.name}
					name="network"
					onChange={(e) => this.onChangeNetwork(i, e)}
					checked={name === i.name}
				/>
				<label className="label" htmlFor={i.name}>
					<span className="label-text">{i.name}</span>
				</label>
				{
					!NETWORKS.find((n) => n.name === i.name) ?
						<button onClick={(e) => this.onDeleteNetwork(i, e)}>
							delete
						</button> : null
				}
			</div>
		));
	}

	render() {

		// network: oldNetwork,
		const {
			history, address, name, registrator,
		} = this.props;


		const { network, showCustom } = this.state;

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
						<div className="radio-list">
							{ this.renderNetworks() }
							<div className="radio">
								<input
									type="radio"
									id="custom"
									name="network"
									onChange={(e) => this.onShowCustom(e)}
									checked={network.name === 'custom'}
								/>
								<label className="label" htmlFor="custom">
									<span className="label-text">custom</span>
								</label>
							</div>
						</div>
						<AddCustomNetwork
							showCustom={showCustom}
							address={address}
							name={name}
							registrator={registrator}
							setFormValue={this.props.setFormValue}
						/>
					</div>
					<div className="form-panel">
						<div className="check">
							<input type="checkbox" id="addToNetworks" />
							<label className="label" htmlFor="addToNetworks">
								<span className="label-text">Switch to this Network upon creating</span>
							</label>
						</div>
						{/* onClick={(e) => this.onSaveNetwork(e)} */}
						<Button
							basic
							type="submit"
							className="main-btn"
							content="Add Custom"
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
	network: PropTypes.object.isRequired,
	networks: PropTypes.array.isRequired,
	address: PropTypes.object.isRequired,
	name: PropTypes.object.isRequired,
	registrator: PropTypes.object.isRequired,
	saveNetwork: PropTypes.func.isRequired,
	addNetwork: PropTypes.func.isRequired,
	deleteNetwork: PropTypes.func.isRequired,
	setFormValue: PropTypes.func.isRequired,
	clearForm: PropTypes.func.isRequired,
};

export default withRouter(connect(
	(state) => ({
		network: state.global.get('network').toJS(),
		networks: state.global.get('networks').toJS(),
		address: state.form.getIn([FORM_ADD_CUSTOM_NETWORK, 'address']),
		name: state.form.getIn([FORM_ADD_CUSTOM_NETWORK, 'name']),
		registrator: state.form.getIn([FORM_ADD_CUSTOM_NETWORK, 'registrator']),
	}),
	(dispatch) => ({
		addNetwork: (address, name, registrator) => dispatch(addNetwork(address, name, registrator)),
		saveNetwork: (network) => dispatch(saveNetwork(network)),
		deleteNetwork: (network) => dispatch(deleteNetwork(network)),
		setFormValue: (field, value) => dispatch(setFormValue(FORM_ADD_CUSTOM_NETWORK, field, value)),
		clearForm: () => dispatch(clearForm(FORM_ADD_CUSTOM_NETWORK)),
	}),
)(Networks));
