import React from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Footer extends React.PureComponent {

	render() {

		const connected = (
			<div className="footer">
				<ul>
					<li>Echo.171205</li>
					<li className="pipeline">
                        Latency
						<span className="pipeline-latency"> {this.props.latency} MS </span>
                        / Block
						<span className="pipeline-block"> #{this.props.lastBlock}</span>
					</li>
					<li>
						<span className="status green">Connected</span>
					</li>
				</ul>
			</div>
		);

		const disconnected = (
			<div className="footer disconnected">
				<ul>
					<li>
                        Check Your Connection
						<Button type="submit" size="tiny" color="black">Ok</Button>
					</li>
					<li>
						<span className="status white">Disconnected</span>
					</li>
				</ul>
			</div>
		);

		return this.props.isConnect ? connected : disconnected;
	}

}

Footer.propTypes = {
	lastBlock: PropTypes.any.isRequired,
	isConnect: PropTypes.any.isRequired,
	latency: PropTypes.any.isRequired,
};

export default connect((state) => ({
	lastBlock: state.echojs.getIn(['meta', 'lastBlockNumber']) || '',
	isConnect: state.echojs.getIn(['echojs', 'isConnected']),
	latency: state.echojs.getIn(['echojs', 'latency']),
}))(Footer);
