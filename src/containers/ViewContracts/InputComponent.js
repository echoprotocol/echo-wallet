import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'semantic-ui-react';

class InputRequest extends React.Component {

	render() {
		return (
			<div className="watchlist-line">
				<div className="watchlist-row">
					<span className="order">4. </span>
					<span className="arrow"> {'>'} </span>
					<span className="row-title"> balanceOf </span>
					<Input size="mini" placeholder="src (address)" />
					<Button size="mini" content="query" />
				</div>
				<div className="watchlist-row--h">
					<span className="icon-dotted" />
					<span className="type"> unit256 </span>
				</div>
				<div className="watchlist-embed">
					<div>
                        [ <strong>Balance of </strong>
                        method Response ]

					</div>
					<div>
						<span className="type"> unit256 </span>
						<span className="colon">:</span>
						<span className="value"> 0 </span>
					</div>
				</div>
			</div>
		);
	}

}

export default connect()(InputRequest);
