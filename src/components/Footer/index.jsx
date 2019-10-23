import React from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CACHE_MAPS } from 'echojs-lib';

import { version } from '../../../package.json';
import NetworkDropdown from './NetworkDropdown';
import { connection } from '../../actions/GlobalActions';
import { openModal } from '../../actions/ModalActions';
import { MODAL_INFO } from '../../constants/ModalConstants';

class Footer extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			warn: true,
		};
	}
	onReconnect() {
		this.props.connection();
	}

	openModal() {
		this.props.openModal();
	}

	render() {
		const {
			isConnect, latency, lastBlock, error,
		} = this.props;
		const { warn } = this.state;
		const connected = (
			<div className="footer">
				<ul>
					<li>
						<button onClick={() => { this.openModal(); }}>Echo.{version}</button>
					</li>
					<li>
						<NetworkDropdown lastBlock={lastBlock} />
					</li>
				</ul>
			</div>
		);

		const warning = (
			<div className="footer warning">
				<ul>
					<li>
						Total weight of all the keys won&rsquo;t be enough to sign a transaction.
						<Button type="submit" size="tiny" color="black" onClick={() => {}}>Keys Parameters</Button>
					</li>
					<li />
				</ul>
			</div>
		);

		const disconnected = (
			<div className="footer disconnected">
				<ul>
					<li>
                        Check Your Connection
						<Button type="submit" size="tiny" color="black" onClick={() => this.onReconnect()}>Try again</Button>
					</li>
					<li>
						<NetworkDropdown lastBlock={lastBlock} disconnected />
					</li>
				</ul>
			</div>
		);

		const errored = (
			<div className="footer disconnected">
				<ul>
					<li>{error}</li>
					<li />
				</ul>
			</div>
		);

		if (isConnect && !latency.error) {

			if (error) {
				return errored;
			}

			// if (warn) {
			// 	return warning;
			// }

			return connected;
		}

		return disconnected;
	}

}

Footer.propTypes = {
	lastBlock: PropTypes.any,
	isConnect: PropTypes.any,
	latency: PropTypes.any,
	error: PropTypes.string,
	connection: PropTypes.func.isRequired,
	openModal: PropTypes.func.isRequired,
};

Footer.defaultProps = {
	lastBlock: '',
	isConnect: false,
	error: null,
	latency: {
		value: 0,
		error: null,
	},
};


export default connect(
	(state) => ({
		latency: state.echojs.getIn(['meta', 'latency']),
		lastBlock: state.echojs.getIn([CACHE_MAPS.DYNAMIC_GLOBAL_PROPERTIES, 'head_block_number']),
		isConnect: state.global.get('isConnected'),
		error: state.global.get('globalError'),
	}),
	(dispatch) => ({
		openModal: () => dispatch(openModal(MODAL_INFO)),
		connection: () => dispatch(connection()),
	}),
)(Footer);
