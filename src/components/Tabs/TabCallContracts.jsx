import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'semantic-ui-react';

class TabCallContracts extends React.Component {

	render() {
		return (
			<div className="tab-content">
				<Button icon="trash" content="remove from watchlist" />
				<div className="watchlist">
					<div className="watchlist-line">
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="order">1. </span>
								<span className="arrow"> {'>'} </span>
							</div>
							<div className="watchlist-col">
								<span className="item row-title"> stop </span>
								<span className="item arrow"> → </span>
								<Button size="mini" content="call" />
							</div>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="order">2. </span>
								<span className="arrow"> {'>'} </span>
							</div>
							<div className="watchlist-col">
								<span className="row-title item"> approve </span>
								<span className="arrow item"> → </span>
								<Input className="item" size="mini" placeholder="guy (address)" />
								<span className="comma item">,</span>
								<Input className="item" size="mini" placeholder="wad (unit256)" />
								<Button className="item" size="mini" content="call" />
							</div>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="order">3. </span>
								<span className="arrow"> {'>'} </span>
							</div>
							<div className="watchlist-col">
								<span className="row-title item"> setOwner </span>
								<span className="arrow item"> → </span>
								<Input className="item" size="mini" placeholder="owner_ (address)" />
								<Button className="item" size="mini" content="call" />
							</div>
						</div>
					</div>

					<div className="watchlist-line">
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="order">4. </span>
								<span className="arrow"> {'>'} </span>
							</div>
							<div className="watchlist-col">
								<span className="item row-title"> transferFrom </span>
								<Input className="item" size="mini" placeholder="src (address)" />
								<span className="item comma">,</span>
								<Input className="item" size="mini" placeholder="dst (address)" />
								<span className="item comma">,</span>
								<Input className="item" size="mini" placeholder="wad (unit256)" />
								<Button className="item" size="mini" content="call" />
							</div>
						</div>
					</div>

					<div className="watchlist-line">
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="order">5. </span>
								<span className="arrow"> {'>'} </span>
							</div>
							<div className="watchlist-col">
								<span className="item row-title"> push </span>
								<span className="arrow item"> → </span>
								<Input className="item" size="mini" placeholder="dst (address)" />
								<span className="item comma">,</span>
								<Input className="item" size="mini" placeholder="wad (unit256)" />
								<Button className="item" size="mini" content="call" />
							</div>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="order">6. </span>
								<span className="arrow"> {'>'} </span>
							</div>
							<div className="watchlist-col">
								<span className="item row-title"> setName </span>
								<span className="arrow item"> → </span>
								<Input className="item" size="mini" placeholder="name_ (bytes32)" />
								<Button className="item" size="mini" content="call" />
							</div>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="order">7. </span>
								<span className="arrow"> {'>'} </span>
							</div>
							<div className="watchlist-col">
								<span className="item row-title"> mint </span>
								<span className="arrow item"> → </span>
								<Input className="item" size="mini" placeholder="wad (unit256)" />
								<Button className="item" size="mini" content="call" />
							</div>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="order">8. </span>
								<span className="arrow"> {'>'} </span>
							</div>
							<div className="watchlist-col">
								<span className="item row-title"> setAuthotity </span>
								<span className="arrow item"> → </span>
								<Input className="item" size="mini" placeholder="authotity_ (address)" />
								<Button className="item" size="mini" content="call" />
							</div>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="order">9. </span>
								<span className="arrow"> {'>'} </span>
							</div>
							<div className="watchlist-col">
								<span className="item row-title"> transfer </span>
								<span className="arrow item"> → </span>
								<Input className="item" size="mini" placeholder="src (address)" />
								<span className="item comma">,</span>
								<Input className="item" size="mini" placeholder="wad (unit256)" />
								<Button className="item" size="mini" content="call" />
							</div>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="order">10. </span>
								<span className="arrow"> {'>'} </span>
							</div>
							<div className="watchlist-col">
								<span className="item row-title"> burn </span>
								<span className="arrow item"> → </span>
								<Input className="item" size="mini" placeholder="wad (address)" />
								<Button className="item" size="mini" content="call" />
							</div>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="order">11. </span>
								<span className="arrow"> {'>'} </span>
							</div>
							<div className="watchlist-col">
								<span className="item row-title"> transfer </span>
								<span className="arrow item"> → </span>
								<Input className="item" size="mini" placeholder="dst (address)" />
								<span className="item comma">,</span>
								<Input className="item" size="mini" placeholder="wad (unit256)" />
								<Button className="item" size="mini" content="call" />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

export default connect()(TabCallContracts);
