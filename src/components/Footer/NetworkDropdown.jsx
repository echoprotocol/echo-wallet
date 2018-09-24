import React from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import { NETWORKS } from '../../constants/GlobalConstants';

import { saveNetwork, deleteNetwork } from '../../actions/GlobalActions';
import { NETWORKS_PATH } from '../../constants/RouterConstants';

class Network extends React.PureComponent {

	onDropdownChange(e, value) {
		if ((e.type !== 'click' && e.keyCode !== 13) || e.target.id === 'btn-dlt') {
			return;
		}

		if (value === 'custom') {
			this.props.history.push(NETWORKS_PATH);
		} else {
			this.onSaveNetwork(value);
		}
	}

	onDeleteNetwork(network, e) {
		e.preventDefault();

		this.props.deleteNetwork(network);
	}

	onSaveNetwork(name) {
		const { networks, network: oldNetwork } = this.props;

		if (name === oldNetwork.name || name === 'custom') {
			return;
		}

		const network = NETWORKS.concat(networks).find((i) => i.name === name);

		this.props.saveNetwork(network);
	}

	getList(networks) {
		const { name } = this.props.network;

		return networks.map((i) => (
			{
				value: i.name,
				key: i.name,
				selected: name === i.name,
				content: (

					<React.Fragment>
						<span className="label-text">{i.name}</span>
						{ !NETWORKS.find((n) => n.name === i.name) ?
							<Button
								id="btn-dlt"
								onClick={(e) => this.onDeleteNetwork(i, e)}
								className="icon-remove"
							/> : null
						}
					</React.Fragment>
				),
			}));
	}

	getDivider(key) {
		return {
			key,
			disabled: true,
			selected: false,
			className: 'item-divider',
		};
	}

	render() {
		const { networks, network } = this.props;

		let options = this.getList(NETWORKS);

		if (networks.length) {
			options.push(this.getDivider('divider'));
			options = options.concat(this.getList(networks));
		}
		options.push({
			value: 'custom',
			key: 'custom',
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
				options={options}
				onChange={(e, { value }) => this.onDropdownChange(e, value)}
				direction="left"
				icon={false}
				selectOnBlur={false}
				upward
				className={classnames('network-dropdown', {
					disconnected: this.props.disconnected,
				})}
				trigger={
					<div className="network-dropdown-trigger">
						<span className="description">
							{ this.props.disconnected ? 'Disconnected:' : 'Network:' }
						</span>
						<span className="status connected">
							<div className="ellipsis">{network.name}</div>
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
	history: PropTypes.object.isRequired,
	saveNetwork: PropTypes.func.isRequired,
	deleteNetwork: PropTypes.func.isRequired,
	disconnected: PropTypes.bool,
};

Network.defaultProps = {
	disconnected: false,
};

export default withRouter(connect(
	(state) => ({
		network: state.global.get('network').toJS(),
		networks: state.global.get('networks').toJS(),
	}),
	(dispatch) => ({
		saveNetwork: (network) => dispatch(saveNetwork(network)),
		deleteNetwork: (network) => dispatch(deleteNetwork(network)),
	}),
)(Network));
