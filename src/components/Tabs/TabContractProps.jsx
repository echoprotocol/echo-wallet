import React from 'react';
import { connect } from 'react-redux';
import { Button, Accordion, Input } from 'semantic-ui-react';

class TabContractProps extends React.Component {

	constructor() {
		super();
		this.state = { activeIndex: 0 };
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e, titleProps) {
		const { index } = titleProps;
		const { activeIndex } = this.state;
		const newIndex = activeIndex === index ? -1 : index;

		this.setState({ activeIndex: newIndex });
	}
	render() {
		const { activeIndex } = this.state;
		return (
			<div className="tab-content">
				<Button icon="trash" content="remove from watchlist" />
				<Accordion className="watchlist" fluid styled>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="order">1. </span>
							<span className="arrow"> {'>'} </span>
							<span className="row-title"> name </span>
							<span className="arrow"> → </span>
							<span className="value">
                                0x0000000000000000000000000000000000000000000000000000000000000000
							</span>
							<span className="type"> bytes32 </span>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="order">2. </span>
							<span className="arrow"> {'>'} </span>
							<span className="row-title"> totalSupply </span>
							<span className="arrow"> → </span>
							<span className="value">
                                1000000000000000000000000000
							</span>
							<span className="type"> unit256 </span>
						</div>
					</div>
					<div className="watchlist-line">
						<div className="watchlist-row">
							<span className="order">3. </span>
							<span className="arrow"> {'>'} </span>
							<span className="row-title"> decimals </span>
							<span className="arrow"> → </span>
							<span className="value"> 18 </span>
							<span className="type"> unit256 </span>
						</div>
					</div>
					<Accordion.Title
						active={activeIndex === 0}
						className="watchlist-line"
						index={0}
						onClick={this.handleClick}
					>
						<div className="watchlist-row">
							<span className="order">4. </span>
							<span className="arrow"> {'>'} </span>
							<span className="row-title"> balanceOf </span>
							<Input size="mini" placeholder="src (adress)" />
						</div>
						<div className="watchlist-row">
						</div>
					</Accordion.Title>
					<Accordion.Content
						className="watchlist-line"
						active={activeIndex === 0}
					>
                        0
					</Accordion.Content>

					<Accordion.Title
						className="watchlist-line"
						active={activeIndex === 1}
						index={1}
						onClick={this.handleClick}
					>
                        title 1
					</Accordion.Title>
					<Accordion.Content
						className="watchlist-line"
						active={activeIndex === 1}
					>
                        1
					</Accordion.Content>
				</Accordion>
			</div>
		);
	}

}

export default connect()(TabContractProps);
