import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class InputLine extends React.Component {

	// constant: true
	// constantValue: "Example Fixed Supply Token"
	// inputs: []
	// name: "name"
	// outputs: [{…}]
	// payable: false
	// stateMutability: "view"
	// type: "function"

	render() {
		const { constant, typeOptions } = this.props;
		return (
			<div className="watchlist-line">
				<div className="watchlist-row">
					<span className="row-title"> {constant.name} </span>
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
						{constant.inputs.map((input, index) => {
							const id = index;
							if (id !== 0) {
								return (
									<div key={id}>
										<span className="comma item">,</span>
										<Input className="item" size="mini" placeholder={`${input.name} (${input.type})`} />
									</div>
								);
							}
							return (<Input key={id} className="item" size="mini" placeholder={`${input.name} (${input.type})`} />);
						})}
						{/* <Input className="item" size="mini" placeholder="guy (address)" /> */}
						{/* <span className="comma item">,</span> */}
						{/* <Input className="item" size="mini" placeholder="wad (unit256)" /> */}
						<Button className="item" size="mini" content="call" />
					</div>
				</div>
			</div>
		);
	}

}

InputLine.propTypes = {
	typeOptions: PropTypes.array.isRequired,
	constant: PropTypes.object.isRequired,
};

export default connect()(InputLine);
