import React from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import { NETWORKS } from '../../constants/GlobalConstants';

import { FORM_SIGN_UP } from '../../constants/FormConstants';

import { saveNetwork, deleteNetwork } from '../../actions/GlobalActions';
import { NETWORKS_PATH } from '../../constants/RouterConstants';

import ProgressBar from '../ProgressBar';
import RemoteNode from './RemoteNode';
import { openModal } from '../../actions/ModalActions';
import LocalNode from './LocalNode';


class Network extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			open: false,
		};

	}

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
		this.setState({ open: false });
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
		// console.log('PLATFROM', PLATFROM);
		const { name } = this.props.network;

		return networks.map((i) => (
			{
				value: i.name,
				key: i.name,
				selected: name === i.name,
				content: (

					<div className="network-wrap">
						<div className="network">
							<div className="label-text">
								<span className="network-title">
									{i.name}
								</span>
							</div>
							<span className="label-link">{i.url}</span>
							{ !NETWORKS.find((n) => n.name === i.name) &&
							<Button
								id="btn-dlt"
								onClick={(e) => this.onDeleteNetwork(i, e)}
								className="icon-remove"
							/>
							}
						</div>
						{ i.name === 'testnet' &&
							<div className="node-info">
								{
									this.props.isNodeSyncing ? (
										<RemoteNode value={parseInt(this.props.localNodePercent, 10)} />
									) : (
										<LocalNode />
									)
								}
							</div>
						}
					</div>
				),
			}
		));
	}

	openDropdown(e) {
		if (e.target.className === 'action-node') {
			return;
		}

		const { open } = this.state;
		if (!open) { this.setState({ open: true }); }
	}

	render() {
		const { open } = this.state;
		const {
			networks, network, loading, disconnected, warning,
		} = this.props;
		let options = [
			{
				value: 'Choose network',
				key: 'choose-network',
				className: 'item-header',
				content: 'Choose network',
				disabled: true,
				onClick: (e) => e.preventDefault(),
			},
		];
		options = options.concat(this.getList(NETWORKS));

		if (networks.length || networks.length === 0) {
			options = options.concat(this.getList(networks));
		}
		options.push({
			value: 'custom',
			key: 'custom',
			className: 'item-footer',
			selected: false,
			content: (
				<div className="network-link">
					<span className="network-link-content">+ Add custom Network</span>
				</div>),
		});

		return (
			<div
				className="network-dropdown"
				onFocus={(e) => this.openDropdown(e)}
				onBlur={() => this.setState({ open: false })}
				role="button"
				tabIndex="0"
			>
				<div className="trigger" >
					<span className="description">
						{ disconnected ? 'Disconnected:' : 'Network:' }
					</span>
					<span className="status connected">
						<div className="ellipsis">{network.name}</div>
					</span>

					<ProgressBar
						size={20}
						value={parseInt(this.props.localNodePercent, 10)}
						disconnected={disconnected}
						warning={warning}
						openModal={this.props.openModal}
						isNodeSyncing={this.props.isNodeSyncing}
					/>

					<span className="pipeline-block">
								Block
						<span>{this.props.lastBlock}</span>
					</span>
					<span className="icon dropdown" />
				</div>
				<Dropdown
					open={open}
					options={options}
					onChange={(e, { value }) => this.onDropdownChange(e, value)}
					direction="left"
					icon={false}
					selectOnBlur={false}
					upward
					tabIndex="-1"
					disabled={loading}
					className={classnames('', {
						disconnected,
						warning,
					})}
				/>

			</div>

		);
	}

}

Network.propTypes = {
	loading: PropTypes.bool,
	network: PropTypes.object.isRequired,
	networks: PropTypes.array.isRequired,
	history: PropTypes.object.isRequired,
	saveNetwork: PropTypes.func.isRequired,
	deleteNetwork: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
	lastBlock: PropTypes.any.isRequired,
	localNodePercent: PropTypes.any.isRequired,
	isNodeSyncing: PropTypes.bool.isRequired,
	disconnected: PropTypes.bool,
	warning: PropTypes.bool,
};

Network.defaultProps = {
	disconnected: false,
	loading: false,
	warning: false,
};

export default withRouter(connect(
	(state) => ({
		network: state.global.get('network').toJS(),
		networks: state.global.get('networks').toJS(),
		localNodePercent: state.global.get('localNodePercent'),
		isNodeSyncing: state.global.get('isNodeSyncing'),
		loading: state.form.getIn([FORM_SIGN_UP, 'loading']),
	}),
	(dispatch) => ({
		saveNetwork: (network) => dispatch(saveNetwork(network)),
		deleteNetwork: (network) => dispatch(deleteNetwork(network)),
		openModal: (value) => dispatch(openModal(value)),
	}),
)(Network));
