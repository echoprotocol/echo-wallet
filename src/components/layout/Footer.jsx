import React from 'react';
import { Button } from 'semantic-ui-react';

export default class Footer extends React.PureComponent {

	constructor() {
		super();
		this.state = { connected: false };
	}
	render() {

		const connected = (
			<div className="footer">
				<ul>
					<li>Bitshares.171205</li>
					<li className="pipeline">
                        Latency
						<span className="pipeline-latency"> 419 MS </span>
                        / Block
						<span className="pipeline-block"> #22577381</span>
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

		if (this.state.connected) {
			return (
				connected
			);
		}
		return (
			disconnected
		);
	}

}
