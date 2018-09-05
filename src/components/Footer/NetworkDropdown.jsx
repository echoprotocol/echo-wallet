// Удалить этот файл, если не перейдем обратно к нетворкам в дропдауне

import React from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { NETWORKS } from '../../constants/GlobalConstants';
import { FORM_ADD_CUSTOM_NETWORK } from '../../constants/FormConstants';

import { setFormValue, clearForm } from '../../actions/FormActions';
import { saveNetwork, addNetwork, deleteNetwork } from '../../actions/GlobalActions';
import { NETWORKS_PATH } from '../../constants/RouterConstants';

class Network extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			network: props.network,
		};
	}
	onDropdownChange(e, value) {

		if (value === 'netCustom') {

			return;
		}
		if (e.type === 'click') {
			this.onChangeNetwork(value);
			return;
		}
		if (e.keyCode === 13) {
			this.onChangeNetwork(value);
		}
	}

	onDeleteNetwork(network) {
		this.props.deleteNetwork(network);
	}

	onChangeNetwork(value) {
		const { networks } = this.props;
		const network = networks.find((arr, i) => networks[i].name === value);
		this.setState({ network });
	}

	renderNetworks() {
		const { networks } = this.props;
		const { name } = this.state.network;
		return networks.map((i) => (
			{
				value: i.name,
				key: i.name,
				selected: name === i.name,
				content: (

					<React.Fragment>
						<span className="label-text">{i.name}</span>
						{
							!NETWORKS.find((n) => n.name === i.name) ?
								<Button onClick={(e) => this.onDeleteNetwork(i, e)} className="icon-remove" /> : null
						}
					</React.Fragment>
				),
			}));
	}

	render() {
		let options = [];

		const networks = this.renderNetworks();
		options = options.concat(networks);
		options.push({
			disabled: true,
			selected: false,
			key: 'divider',
			className: 'item-divider',
		});

		options.push({
			value: 'netCustom',
			key: 'netCustom',
			className: 'item-link',
			selected: false,
			content: (
				<Link className="network-link" to={NETWORKS_PATH} >
					+ Add custom Network
				</Link>
			),
		});

		return (
			<Dropdown
				upward
				options={options}
				onChange={(e, { value }) => this.onDropdownChange(e, value)}
				direction="left"
				icon={false}
				className="network-dropdown"
				trigger={
					<div className="network-dropdown-trigger">
						<span className="description">Network:</span>
						<span className="status connected">
							<div className="ellipsis">TestNet</div>
						</span>
						<span className="icon-dropdown_arrow" />
					</div>
				}
			/>
		);


	}

}

Network.propTypes = {
	network: PropTypes.object.isRequired,
	networks: PropTypes.array.isRequired,
	deleteNetwork: PropTypes.func.isRequired,
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
)(Network));
