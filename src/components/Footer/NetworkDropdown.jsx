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
						<div className="label-text">
							<span className="name">{i.name}</span>
						</div>
						<span className="label-link">{i.url}</span>
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
		const {
			networks, network, loading, disconnected, warning,
		} = this.props;
		let options = this.getList(NETWORKS);

		if (networks.length || networks.length === 0) {
			options.push(this.getDivider('divider'));
			options = options.concat(this.getList(networks));
		}
		options.push({
			value: 'custom',
			key: 'custom',
			className: 'item-link',
			selected: false,
			content: (<div className="network-link">+ Add custom Network</div>),
		});

		return (
			<React.Fragment>
				<Dropdown
					options={options}
					onChange={(e, { value }) => this.onDropdownChange(e, value)}
					direction="left"
					icon={false}
					selectOnBlur={false}
					upward
					disabled={loading}
					className={classnames('network-dropdown', {
						disconnected,
						warning,
					})}
					trigger={
						<div className="dropdown-trigger">

							<span className="description">
								{ disconnected ? 'Disconnected:' : 'Network:' }
							</span>
							<span className="status connected">
								<div className="ellipsis">{network.name}</div>
							</span>

							<ProgressBar
								percentage={30}
								size={20}
								value={64}
							/>
							<span className="pipeline-block">
								Block
								<span>{this.props.lastBlock}</span>
							</span>
							<span className="icon dropdown" />
						</div>
					}
				/>

			</React.Fragment>
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
	lastBlock: PropTypes.any.isRequired,
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
		loading: state.form.getIn([FORM_SIGN_UP, 'loading']),
	}),
	(dispatch) => ({
		saveNetwork: (network) => dispatch(saveNetwork(network)),
		deleteNetwork: (network) => dispatch(deleteNetwork(network)),
	}),
)(Network));
