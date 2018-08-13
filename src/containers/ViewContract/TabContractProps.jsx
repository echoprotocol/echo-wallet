import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Dropdown } from 'semantic-ui-react';

class TabContractProps extends React.Component {

	render() {
		const typeOptions = [
			{
				text: 'unit256',
				value: 'unit256',
			},
			{
				text: 'bytes32',
				value: 'bytes32',
			},
			{
				text: 'address',
				value: 'address',
			},
		];
		return (
			<div className="tab-content">
				<div className="watchlist">
					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="row-title"> name </span>
						</div>
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="icon-dotted" />
							</div>
							<div className="watchlist-col">
								<Dropdown
									placeholder="Empty"
									compact
									selection
									className="item contract-type-dropdown air"
									options={typeOptions}
								/>
								{/* Можно добавить класс blue */}
								<span className="value blue item">
                                0x0000000000000000000000000000000000000000000000000000000000000000
								</span>
							</div>
						</div>
					</div>

					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="row-title"> name </span>
						</div>
						<div className="watchlist-row">
							<div className="watchlist-col">
								<span className="icon-dotted" />
							</div>
							<div className="watchlist-col">
								<Dropdown
									placeholder="Empty"
									compact
									selection
									className="item contract-type-dropdown air"
									options={typeOptions}
								/>
								<Input className="item" size="mini" placeholder="guy (address)" />
								<span className="comma item">,</span>
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

export default connect()(TabContractProps);
