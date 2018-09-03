import React from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { version } from '../../../package.json';
import { NETWORKS_PATH } from '../../constants/RouterConstants';
import { connection } from '../../actions/GlobalActions';

class Footer extends React.PureComponent {


	onReconnect() {
		this.props.connection();
	}

	render() {

		const { isConnect, latency, lastBlock } = this.props;

		const connected = (
			<div className="footer">
				<ul>
					<li>Echo.{version}</li>
					<li className="pipeline">
                        Latency
						<span className="pipeline-latency"> {latency.value} ms </span>
                        / Block
						<span className="pipeline-block"> #{lastBlock}</span>
					</li>
					<li>
						<span className="status green">
                            Connected to
						</span>
						<Link className="network-link" to={NETWORKS_PATH}> https://echo-tmp-wallet.pixelplex.io</Link>
					</li>
				</ul>
			</div>
		);

		const disconnected = (
			<div className="footer disconnected">
				<ul>
					<li>
                        Check Your Connection
						<Button type="submit" size="tiny" color="black" onClick={(e) => this.onReconnect(e)}>Try again</Button>
					</li>
					<li>
						<span className="status white">Disconnected</span>
					</li>
				</ul>
			</div>
		);

		return isConnect && !latency.error ? connected : disconnected;
	}

}

Footer.propTypes = {
	lastBlock: PropTypes.any,
	isConnect: PropTypes.any,
	latency: PropTypes.any,
	connection: PropTypes.func.isRequired,
};

Footer.defaultProps = {
	lastBlock: '',
	isConnect: false,
	latency: {
		value: 0,
		error: null,
	},
};


export default connect(
	(state) => ({
		latency: state.echojs.getIn(['meta', 'latency']),
		lastBlock: state.echojs.getIn(['meta', 'lastBlockNumber']),
		isConnect: state.echojs.getIn(['system', 'isConnected']),
	}),
	(dispatch) => ({
		connection: () => dispatch(connection()),
	}),
)(Footer);
