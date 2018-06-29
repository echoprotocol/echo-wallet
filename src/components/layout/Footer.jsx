import React from 'react';

class Footer extends React.PureComponent {

	render() {

		return (
			<div className='footer'>
				<ul>
					<li>Bitshares.171205</li>
					<li className='pipeline'>
						Latency
						<span className="pipeline-latency"> 419 MS </span> 
						/ Block
						<span className="pipeline-block"> #22577381</span> 
					</li>
					<li>
						<span className='status green'>Connected</span>
					</li>
				</ul>
			</div>
		);
	}

}

export default Footer;
